import { ChevronLeft, SendHorizonal } from "lucide-react";
import type { Route } from "./+types/home";
import { Link, redirect, useFetcher } from "react-router";
import { Button, Textarea } from "~/components";
import { useState } from "react";
import { logto } from "~/auth.server";
import { database } from "~/database/context";
import { messagesTable, usersTable } from "~/database/schema";
import { eq } from "drizzle-orm";

const MINI_LOGO =
  "https://hbjwdmibaweonejpklvh.supabase.co/storage/v1/object/public/public_files//mini-logo.png";

interface Message {
  id: number;
  name: string | null;
  message: string;
  picture: string | null;
}

interface UserMessage {
  user: string;
  picture: string;
  messages: { id: number; message: string }[];
}

const massageMsgs = (messages: Message[]) => {
  const groupedMessages: UserMessage[] = [];

  messages.forEach((message) => {
    const lastGroup = groupedMessages[groupedMessages.length - 1];

    if (lastGroup && lastGroup.user === message.name) {
      lastGroup.messages.push({
        id: message.id,
        message: message.message,
      });
    } else {
      groupedMessages.push({
        user: message.name!,
        picture: message.picture!,
        messages: [
          {
            id: message.id,
            message: message.message,
          },
        ],
      });
    }
  });

  return groupedMessages;
};

export async function loader({ request }: Route.LoaderArgs) {
  const context = await logto.getContext({})(request);

  if (!context.isAuthenticated) {
    return redirect("/auth/sign-in");
  }

  const db = database();

  const messages = await db
    .select({
      id: messagesTable.id,
      name: usersTable.name,
      message: messagesTable.text,
      picture: usersTable.pictureUrl,
    })
    .from(messagesTable)
    .leftJoin(usersTable, eq(usersTable.id, messagesTable.userId));

  const massages = massageMsgs(messages);
  return { messages: massages.reverse() };
}

export default function Chat({ loaderData }: Route.ComponentProps) {
  const { messages } = loaderData;

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-slate-200">
      <div className="flex max-h-screen flex-col items-center justify-start md:min-h-80 md:rounded-3xl md:border-2 md:border-black">
        <Header />
        <Timeline messages={messages} />
        <ChatInput />
      </div>
    </div>
  );
}

const Header = () => (
  <div className="flex h-[10%] w-full flex-row items-center py-3">
    <Link to={"/"}>
      <ChevronLeft className="size-8" />
    </Link>
    <img
      src={MINI_LOGO}
      alt="Wedding logo"
      className="ml-6 size-9 rounded-full border border-white bg-slate-100 p-px"
    />
    <h3 className="ml-3 font-playwrite">Laura & Rene - Wedding</h3>
  </div>
);

const Timeline = ({ messages }: { messages: UserMessage[] }) => (
  <div className="flex max-h-[80%] w-full flex-col-reverse overflow-y-auto bg-slate-300 px-2 py-3 font-playwrite text-sm font-extralight scrollbar-hide md:max-h-[600px]">
    {messages.map((group, idx) => (
      <div
        className={`my-1 max-w-[80%] ${idx % 2 ? "self-start" : "self-end"}`}
        key={idx}
      >
        <div
          className={`flex ${
            idx % 2 ? "flex-row-reverse" : "flex-row"
          }  items-end`}
        >
          <div>
            {group.messages.map((message, jdx) => (
              <div
                key={message.id}
                className={`my-0.5 items-center whitespace-pre-wrap break-words rounded-xl bg-slate-400 px-3 py-1 ${
                  jdx === group.messages.length - 1
                    ? idx % 2
                      ? "rounded-bl-none"
                      : "rounded-br-none"
                    : ""
                }`}
              >
                {message.message}
              </div>
            ))}
          </div>
          <img
            alt="User profile"
            src={group.picture}
            className={`${
              idx % 2 ? "mr-2" : "ml-2"
            } size-8 rounded-full bg-slate-100`}
          />
        </div>
      </div>
    ))}
  </div>
);

const ChatInput = () => {
  const [text, setText] = useState("");
  const fetcher = useFetcher();

  const addMessage = () => {
    if (!text) return;

    const body = { text };
    fetcher.submit(body, { action: "/chat/handle-message", method: "post" });

    setText("");
  };

  return (
    <div className="flex h-[10%] w-full flex-row items-center p-1">
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
  );
};
