import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SpotifySearch,
} from '~/components'
import type { Route } from './+types/home'
import { Form, Link, redirect } from 'react-router'
import { logto } from '~/auth.server'
import { database } from '~/database/context'
import { songsTable, usersTable, type Song, type User } from '~/database/schema'
import { count, desc, eq, sql } from 'drizzle-orm'
import { ExternalLink, House, Trash2 } from 'lucide-react'
import { useEffect, useRef } from 'react'

type SongWithUser = { songs: Song; users: User | null }
type Best = { count: number; name: string | null; picture?: string | null }

interface SpotifyGrantAccess {
  access_token: string
  expires_in: number
}

export async function loader({ request }: Route.LoaderArgs) {
  const context = await logto.getContext({})(request)

  if (!context.isAuthenticated) {
    return redirect('/auth/sign-in')
  }

  const db = database()
  const userId = context.claims?.sub

  const songs = await db
    .select()
    .from(songsTable)
    .leftJoin(usersTable, eq(songsTable.userId, usersTable.id))
    .orderBy(desc(songsTable.createdAt))

  const usersBySongsAdded = await db
    .select({
      count: count(songsTable.id),
      name: usersTable.name,
      picture: usersTable.pictureUrl,
    })
    .from(songsTable)
    .leftJoin(usersTable, eq(songsTable.userId, usersTable.id))
    .groupBy(songsTable.userId, usersTable.name, usersTable.pictureUrl)
    .orderBy(desc(count(usersTable.id)))
    .limit(3)

  const artistsBySongsAdded = await db
    .select({
      count: count(songsTable.id),
      name: songsTable.artist,
      picture: sql`MAX(${songsTable.artistUrl})`.as('picture'),
    })
    .from(songsTable)
    .groupBy(songsTable.artist)
    .orderBy(desc(count(songsTable.id)))
    .limit(3)

  return {
    songs,
    userId,
    users: usersBySongsAdded ?? null,
    artists: artistsBySongsAdded ?? null,
  }
}

export default function Music({ loaderData }: Route.ComponentProps) {
  const { songs, userId, users, artists } = loaderData

  const spotifyRef = useRef<SpotifyGrantAccess | null>(null)
  const hasStats = artists.length > 0 && users.length > 0

  const getToken = async () => {
    if (!spotifyRef.current || Date.now() > spotifyRef.current.expires_in) {
      const response = await fetch('/music/grant-access')
      spotifyRef.current = await response.json()
    }

    return spotifyRef.current?.access_token ?? ''
  }

  useEffect(() => {
    getToken()
  }, [])

  return (
    <div className="flex min-h-svh w-full flex-col items-center bg-slate-200">
      <div className="flex w-full max-w-(--breakpoint-sm) flex-col px-8 py-4">
        <h1 className="font-playwrite mt-4 text-2xl font-light underline decoration-1 underline-offset-4">
          La música de la boda
        </h1>
        <div className="mt-4 flex flex-col rounded-xl bg-sky-900 p-3">
          <SpotifySearch getToken={getToken} />
          <div className="mt-4 mb-2 h-px w-11/12 self-center bg-slate-300" />
          <Playlist songs={songs} userId={userId} />
        </div>
        {hasStats && (
          <>
            <h3 className="font-playwrite mt-6 text-xl font-light underline decoration-1 underline-offset-4">
              Mejores usuarios y artistas
            </h3>
            <div className="mt-4 flex flex-col rounded-xl bg-sky-900 p-3">
              <Stats users={users} artists={artists} />
            </div>
          </>
        )}
        <Buttons />
      </div>
    </div>
  )
}

const Playlist = ({
  songs,
  userId,
}: {
  songs: SongWithUser[]
  userId?: string
}) => (
  <ul className="scrollbar-none h-96 overflow-y-auto">
    {songs.map((s) => (
      <li
        key={s.songs.id}
        className="my-1 flex flex-row gap-x-4 rounded-lg bg-sky-950 px-3 py-2 text-white"
      >
        <img
          src={s.songs.pictureUrl ?? ''}
          alt={`Spotify ${s.songs.name} album picture...`}
          className="w-1/4 max-w-24 rounded-lg"
        />
        <a
          className="flex w-2/4 flex-col"
          href={s.songs.spotifyUrl!}
          target="_blank"
          rel="noreferrer"
        >
          <span className="truncate font-semibold">{s.songs.name}</span>
          <div className="flex flex-row items-baseline justify-start gap-x-2">
            <span className="max-w-3/4 truncate text-sm font-semibold text-gray-400">
              {s.songs.artist}
            </span>
            <ExternalLink className="size-3 text-gray-400" />
          </div>
        </a>
        {s.users && (
          <div className="flex items-center justify-center">
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
)

const UserAvatar = ({ user }: { user: User }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Avatar className="size-10">
          <AvatarImage
            src={user.pictureUrl ?? ''}
            className="size-10 rounded-full border border-white p-px"
          />
          <AvatarFallback className="text-sky-950">L&R</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-fit bg-sky-950 px-3 py-1 text-center text-sm text-white italic">
        Añadida por <span className="font-semibold">{user.name}</span>
      </PopoverContent>
    </Popover>
  )
}

const DeleteSong = ({ id }: { id: string }) => {
  return (
    <Form action="/music/handle-song" method="delete">
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="rounded-full bg-sky-900 p-3">
        <Trash2 className="size-5 stroke-red-600 stroke-[1.5px]" />
      </button>
    </Form>
  )
}

const Stats = ({ users, artists }: { users: Best[]; artists: Best[] }) => (
  <div className="py-4">
    <div className="flex justify-around">
      <div className="flex flex-col items-center gap-y-4">
        {users.map((user, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center"
          >
            <Avatar className={`${index < 1 ? 'size-14' : 'size-9'}`}>
              <AvatarImage
                src={user.picture ?? ''}
                className={`rounded-full ${
                  index < 1 ? 'size-14' : 'size-9'
                } border border-white p-px`}
              />
              <AvatarFallback className="text-sky-950">L&R</AvatarFallback>
            </Avatar>
            <div className="mt-3 flex max-w-32 flex-row rounded-lg bg-white px-2 py-px align-baseline text-xs font-semibold sm:max-w-56">
              <span className="truncate">{user.name ?? ''}</span>
              <span className="ml-1 text-clip">({user.count})</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-y-4">
        {artists.map((artist, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center"
          >
            <Avatar className={`${index < 1 ? 'size-14' : 'size-9'}`}>
              <AvatarImage
                src={artist.picture ?? ''}
                className={`rounded-full ${
                  index < 1 ? 'size-14' : 'size-9'
                } border border-white p-px`}
              />
              <AvatarFallback className="text-sky-950">L&R</AvatarFallback>
            </Avatar>
            <div className="mt-3 flex max-w-32 flex-row rounded-lg bg-white px-2 py-px align-baseline text-xs font-semibold sm:max-w-56">
              <span className="truncate">{artist.name ?? ''}</span>
              <span className="ml-1 text-clip">({artist.count})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const Buttons = () => (
  <div className="flex flex-col justify-around">
    <Link className="mt-8 flex w-full justify-center" to={'/'}>
      <Button className="w-2/3 min-w-min md:w-1/3">
        <House />
        Página principal
      </Button>
    </Link>
  </div>
)
