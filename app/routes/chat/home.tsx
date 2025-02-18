import { ChevronLeft, SendHorizonal, Trash2 } from 'lucide-react'
import type { Route } from './+types/home'
import { Link, redirect, useFetcher } from 'react-router'
import { Button, Textarea } from '~/components'
import { useState } from 'react'
import { logto } from '~/auth.server'
import { database } from '~/database/context'
import { messagesTable, usersTable } from '~/database/schema'
import { eq } from 'drizzle-orm'

const MINI_LOGO =
  'https://hbjwdmibaweonejpklvh.supabase.co/storage/v1/object/public/public_files//mini-logo.png'

interface Message {
  id: number
  name: string | null
  userId: string | null
  message: string
  picture: string | null
}

interface UserMessage {
  user: string
  picture: string
  userId: string
  messages: { id: number; message: string }[]
}

const massageMsgs = (messages: Message[]) => {
  const groupedMessages: UserMessage[] = []

  messages.forEach((message) => {
    const lastGroup = groupedMessages[groupedMessages.length - 1]

    if (lastGroup && lastGroup.user === message.name) {
      lastGroup.messages.push({
        id: message.id,
        message: message.message,
      })
    } else {
      groupedMessages.push({
        user: message.name!,
        userId: message.userId!,
        picture: message.picture!,
        messages: [
          {
            id: message.id,
            message: message.message,
          },
        ],
      })
    }
  })

  return groupedMessages
}

export async function loader({ request }: Route.LoaderArgs) {
  const context = await logto.getContext({})(request)

  if (!context.isAuthenticated) {
    return redirect('/auth/sign-in')
  }

  const db = database()

  const messages = await db
    .select({
      id: messagesTable.id,
      userId: messagesTable.userId,
      name: usersTable.name,
      message: messagesTable.text,
      picture: usersTable.pictureUrl,
    })
    .from(messagesTable)
    .leftJoin(usersTable, eq(usersTable.id, messagesTable.userId))

  const massages = massageMsgs(messages)
  return { messages: massages.reverse(), userId: context.claims?.sub }
}

export default function Chat({ loaderData }: Route.ComponentProps) {
  const { messages, userId } = loaderData

  return (
    <div className="flex h-dvh w-full items-center justify-center bg-slate-200">
      <div className="flex h-dvh w-full flex-col items-center justify-start md:h-4/5 md:max-w-[400px] md:rounded-3xl md:border-2 md:border-black">
        <Header />
        <Timeline messages={messages} userId={userId} />
        <ChatInput />
      </div>
    </div>
  )
}

const Header = () => (
  <div className="flex h-16 w-full flex-row items-center py-3">
    <Link to={'/'}>
      <ChevronLeft className="size-8" />
    </Link>
    <img
      src={MINI_LOGO}
      alt="Wedding logo"
      className="ml-6 size-9 rounded-full border border-white bg-slate-100 p-px"
    />
    <h3 className="font-playwrite ml-3">Laura & René - Wedding</h3>
  </div>
)

const Timeline = ({
  messages,
  userId,
}: {
  messages: UserMessage[]
  userId?: string
}) => {
  const fetcher = useFetcher()

  const deleteMessage = (id: number) => {
    const body = { id }
    fetcher.submit(body, { action: '/chat/handle-message', method: 'delete' })
  }

  return (
    <div className="scrollbar-none flex w-full flex-1 flex-col-reverse overflow-y-auto bg-slate-300 px-2 py-3 font-sans text-sm font-extralight">
      {messages.map((group, idx) => (
        <div
          className={`my-1 w-[90%] ${idx % 2 ? 'self-start' : 'self-end'}`}
          key={idx}
        >
          <div
            className={`flex ${
              idx % 2 ? 'flex-row-reverse items-start' : 'flex-row'
            } items-end gap-x-2`}
          >
            <div className="w-full">
              {group.messages.map((message, jdx) => (
                <div
                  className={`flex flex-row ${
                    idx % 2 ? 'justify-start' : 'justify-end'
                  } gap-3`}
                  key={message.id}
                >
                  {userId == group.userId && (
                    <button
                      onClick={() => {
                        deleteMessage(message.id)
                      }}
                      className="mb-0.5 flex size-6 shrink-0 items-center justify-center self-center rounded-full border border-red-700"
                    >
                      <Trash2 className="size-4 stroke-red-700 stroke-[1.5px]" />
                    </button>
                  )}
                  <div
                    className={`my-0.5 flex max-w-[90%] flex-col items-center rounded-xl bg-slate-400 px-3 py-1 whitespace-pre-line ${
                      jdx === group.messages.length - 1
                        ? idx % 2
                          ? 'rounded-bl-none'
                          : 'rounded-br-none'
                        : ''
                    }`}
                  >
                    {jdx === 0 && (
                      <div
                        className={`w-full truncate text-xs font-medium ${
                          idx % 2 ? 'text-left' : 'text-right'
                        }`}
                      >
                        {group.user}
                      </div>
                    )}
                    <div className="w-full text-left">{message.message}</div>
                  </div>
                </div>
              ))}
            </div>
            <img
              alt="User profile"
              src={group.picture}
              className={`${
                idx % 2 ? 'mr-1' : 'ml-1'
              } size-8 rounded-full bg-slate-100`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

const ChatInput = () => {
  const [text, setText] = useState('')
  const fetcher = useFetcher()

  const addMessage = () => {
    if (!text) return

    const body = { text }
    fetcher.submit(body, { action: '/chat/handle-message', method: 'post' })

    setText('')
  }

  return (
    <div className="flex h-12 w-full flex-row items-center p-1">
      <Textarea
        rows={1}
        value={text}
        placeholder="Escribe un mensaje..."
        onChange={(e) => setText(e.target.value)}
        className="resize-none rounded-full border border-black placeholder:text-slate-800"
      />
      <Button
        onClick={addMessage}
        className="mx-2 rounded-full bg-blue-700 active:bg-blue-900"
      >
        <SendHorizonal className="stroke-white stroke-1" />
      </Button>
    </div>
  )
}
