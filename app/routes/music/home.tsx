import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SpotifySearch,
} from "~/components";
import type { Route } from "./+types/home";
import { Form, redirect } from "react-router";
import { logto } from "~/auth.server";
import { database } from "~/database/context";
import {
  songsTable,
  usersTable,
  type Song,
  type User,
} from "~/database/schema";
import { desc, eq } from "drizzle-orm";
import { Trash2 } from "lucide-react";

type SongWithUser = { songs: Song; users: User | null };

export async function loader({ request }: Route.LoaderArgs) {
  const context = await logto.getContext({})(request);

  if (!context.isAuthenticated) {
    return redirect("/auth/sign-in");
  }

  const db = database();
  const userId = context.claims?.sub;

  let songs = await db
    .select()
    .from(songsTable)
    .leftJoin(usersTable, eq(songsTable.userId, usersTable.id))
    .orderBy(desc(songsTable.createdAt));

  return { songs, userId };
}

export default function Music({ loaderData }: Route.ComponentProps) {
  const { songs, userId } = loaderData;

  return (
    <div className="flex min-h-svh flex-col bg-slate-200 px-8 py-4">
      <h1 className="font-playwrite self-center mt-4 text-2xl font-semibold">
        La música de la boda
      </h1>
      <div className="mt-4 p-3 bg-sky-900 rounded-xl flex flex-col">
        <SpotifySearch />
        <div className="mt-4 mb-2 bg-slate-300 h-px w-11/12 self-center" />
        <Playlist songs={songs} userId={userId} />
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
            <span className="font-bold">{s.songs.name}</span>
            <span className="font-bold text-xs text-gray-400">
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
        <Avatar>
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
