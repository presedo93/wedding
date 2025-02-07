import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SpotifySearch,
} from "~/components";
import type { Route } from "./+types/home";
import { Form, Link, redirect } from "react-router";
import { logto } from "~/auth.server";
import { database } from "~/database/context";
import {
  songsTable,
  usersTable,
  type Song,
  type User,
} from "~/database/schema";
import { count, desc, eq } from "drizzle-orm";
import { House, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type SongWithUser = { songs: Song; users: User | null };
type BestArtist = { count: number; name: string | null };
type BestUser = BestArtist & { picture: string | null };

interface SpotifyGrantAccess {
  access_token: string;
  expires_in: number;
}

export async function loader({ request }: Route.LoaderArgs) {
  const context = await logto.getContext({})(request);

  if (!context.isAuthenticated) {
    return redirect("/auth/sign-in");
  }

  const db = database();
  const userId = context.claims?.sub;

  const songs = await db
    .select()
    .from(songsTable)
    .leftJoin(usersTable, eq(songsTable.userId, usersTable.id))
    .orderBy(desc(songsTable.createdAt));

  const usersBySongsAdded = await db
    .select({
      count: count(songsTable.id),
      name: usersTable.name,
      picture: usersTable.pictureUrl,
    })
    .from(songsTable)
    .leftJoin(usersTable, eq(songsTable.userId, usersTable.id))
    .groupBy(songsTable.userId, usersTable.name, usersTable.pictureUrl)
    .limit(1);

  const artistsBySongsAdded = await db
    .select({
      count: count(songsTable.id),
      name: songsTable.artist,
    })
    .from(songsTable)
    .groupBy(songsTable.artist)
    .orderBy(desc(count(songsTable.id)))
    .limit(1);

  return {
    songs,
    userId,
    bestUser: usersBySongsAdded[0] ?? null,
    bestArtist: artistsBySongsAdded[0] ?? null,
  };
}

export default function Music({ loaderData }: Route.ComponentProps) {
  const { songs, userId, bestUser, bestArtist } = loaderData;
  const spotifyRef = useRef<SpotifyGrantAccess | null>(null);

  const getToken = async () => {
    if (!spotifyRef.current || Date.now() > spotifyRef.current.expires_in) {
      const response = await fetch("/music/grant-access");
      spotifyRef.current = await response.json();
    }

    return spotifyRef.current?.access_token ?? "";
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <div className="bg-slate-200 min-h-svh flex flex-col items-center w-full">
      <div className="flex flex-col max-w-[640px] w-full px-8 py-4">
        <h1 className="mt-4 text-2xl font-playwrite font-light underline decoration-1 underline-offset-4">
          La música de la boda
        </h1>
        <div className="mt-4 p-3 bg-sky-900 rounded-xl flex flex-col">
          <SpotifySearch getToken={getToken} />
          <div className="mt-4 mb-2 bg-slate-300 h-px w-11/12 self-center" />
          <Playlist songs={songs} userId={userId} />
        </div>
        {(bestArtist || bestUser) && (
          <div className="mt-4 p-3 bg-sky-900 rounded-xl flex flex-col">
            <Stats
              bestUser={bestUser}
              bestArtist={bestArtist}
              getToken={getToken}
            />
          </div>
        )}
        <Buttons />
      </div>
    </div>
  );
}

const Playlist = ({
  songs,
  userId,
}: {
  songs: SongWithUser[];
  userId?: string;
}) => {
  return (
    <ul className="h-96 overflow-y-auto scrollbar-hide">
      {songs.map((s) => (
        <li
          key={s.songs.id}
          className="bg-sky-950 gap-x-4 rounded-lg py-2 px-3 text-white my-1 flex flex-row"
        >
          <img
            src={s.songs.pictureUrl ?? ""}
            alt={`Spotify ${s.songs.name} album picture...`}
            className="w-1/4 rounded-lg"
          />
          <div className="w-2/4 flex flex-col">
            <span className="font-semibold">{s.songs.name}</span>
            <span className="font-semibold text-xs text-gray-400">
              {s.songs.artist}
            </span>
          </div>
          {s.users && (
            <div className="flex items-center justify-center w-1/4">
              {s.users.id === userId ? (
                <DeleteSong id={s.songs.id} />
              ) : (
                <UserAvatar user={s.users} />
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

const UserAvatar = ({ user }: { user: User }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Avatar className="size-10">
          <AvatarImage
            src={user.pictureUrl ?? ""}
            className="rounded-full size-10 border border-white p-px"
          />
          <AvatarFallback className="text-sky-950">L&R</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="py-1 px-3 w-fit text-center bg-sky-950 text-white text-sm italic">
        Añadida por <span className="font-semibold">{user.name}</span>
      </PopoverContent>
    </Popover>
  );
};

const DeleteSong = ({ id }: { id: string }) => {
  return (
    <Form action="/music/handle-song" method="delete">
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="bg-sky-900 rounded-full p-3">
        <Trash2 className="size-5 stroke-red-600 stroke-[1.5px] " />
      </button>
    </Form>
  );
};

const Stats = ({
  bestUser,
  bestArtist,
  getToken,
}: {
  bestUser?: BestUser;
  bestArtist?: BestArtist;
  getToken: () => Promise<string>;
}) => {
  const [picture, setPicture] = useState("");

  const handleSearch = async () => {
    if (!bestArtist) return;

    const accessToken = await getToken();

    const params = new URLSearchParams({
      type: "artist",
      limit: "1",
      q: bestArtist.name ?? "",
    });

    const url = `https://api.spotify.com/v1/search?${params.toString()}`;
    const response = await fetch(url, {
      headers: { Authorization: "Bearer " + accessToken },
    });

    const search = await response.json();
    setPicture(search.artists.items.at(0).images.at(-1).url);
  };

  useEffect(() => {
    handleSearch().catch(console.error);
  }, [bestArtist]);

  return (
    <div className="py-4">
      <p className="text-white text-xs font-playwrite text-center">
        El usuario que más canciones ha añadido y el artista más escuchado
        son...
      </p>
      <div className="mt-8 flex justify-around">
        {bestUser && (
          <div className="flex flex-col justify-center items-center">
            <Avatar className="size-16">
              <AvatarImage
                src={bestUser.picture ?? ""}
                className="rounded-full size-16 border border-white p-px"
              />
              <AvatarFallback className="text-sky-950">L&R</AvatarFallback>
            </Avatar>
            <span className="mt-3 px-2 py-px rounded-lg bg-white text-black text-sm font-semibold">
              {bestUser.name ?? ""}
            </span>
          </div>
        )}
        {bestArtist && (
          <div className="flex flex-col justify-center items-center">
            <Avatar className="size-16">
              <AvatarImage
                src={picture}
                className="rounded-full size-16 border border-white p-px"
              />
              <AvatarFallback className="text-sky-950">L&R</AvatarFallback>
            </Avatar>
            <span className="mt-3 px-2 py-px rounded-lg bg-white text-black text-sm font-semibold">
              {bestArtist.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const Buttons = () => (
  <div className="flex flex-col justify-around">
    <Link className="mt-8 flex w-full justify-center" to={"/"}>
      <Button className="w-2/3 md:w-1/3 min-w-min">
        <House />
        Página principal
      </Button>
    </Link>
  </div>
);
