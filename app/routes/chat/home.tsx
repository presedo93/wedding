import { ChevronLeft, SendHorizonal } from "lucide-react";
import type { Route } from "./+types/home";
import { Link } from "react-router";
import { Textarea } from "~/components";

const MINI_LOGO =
  "https://hbjwdmibaweonejpklvh.supabase.co/storage/v1/object/public/public_files//mini-logo.png";

interface Message {
  id: number;
  user: string;
  message: string;
  picture: string;
}

interface UserMessage {
  user: string;
  picture: string;
  messages: { id: number; message: string }[];
}

const MESSAGES = [
  {
    id: 1,
    user: "A",
    message: "Hola",
    picture:
      "https://hbjwdmibaweonejpklvh.supabase.co/storage/v1/object/public/public_files//mini-logo.png",
  },
  {
    id: 2,
    user: "A",
    message: "¿Cómo estás?",
    picture:
      "https://hbjwdmibaweonejpklvh.supabase.co/storage/v1/object/public/public_files//mini-logo.png",
  },
  {
    id: 3,
    user: "B",
    message: "Hola, soy el usuario B",
    picture:
      "https://hbjwdmibaweonejpklvh.supabase.co/storage/v1/object/public/public_files//mini-logo.png",
  },
  {
    id: 4,
    user: "B",
    message: "Tengo una pregunta",
    picture:
      "https://hbjwdmibaweonejpklvh.supabase.co/storage/v1/object/public/public_files//mini-logo.png",
  },
  {
    id: 5,
    user: "A",
    message: "¡Hola de nuevo!",
    picture:
      "https://hbjwdmibaweonejpklvh.supabase.co/storage/v1/object/public/public_files//mini-logo.png",
  },
  {
    id: 6,
    user: "A",
    message: "Otra vez yo",
    picture:
      "https://hbjwdmibaweonejpklvh.supabase.co/storage/v1/object/public/public_files//mini-logo.png",
  },
];

const massageMsgs = (messages: Message[]) => {
  const groupedMessages: UserMessage[] = [];

  messages.forEach((message) => {
    const lastGroup = groupedMessages[groupedMessages.length - 1];

    if (lastGroup && lastGroup.user === message.user) {
      // Si el último grupo es del mismo usuario, añade el mensaje a ese grupo
      lastGroup.messages.push({
        id: message.id,
        message: message.message,
      });
    } else {
      // Si no, crea un nuevo grupo para ese usuario
      groupedMessages.push({
        user: message.user,
        picture: message.picture,
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

export async function loader() {
  const messages = massageMsgs(MESSAGES);
  return { messages };
}

export default function Chat({ loaderData }: Route.ComponentProps) {
  const { messages } = loaderData;

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-start bg-slate-200">
      <Header />
      <Timeline messages={messages} />
      <ChatInput />
    </div>
  );
}

const Header = () => (
  <div className="flex h-14 w-full flex-row items-center py-3 shadow-lg shadow-black">
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
  <div className="flex w-full flex-1 flex-col-reverse bg-slate-300 px-2 py-3 font-playwrite text-sm font-extralight">
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
                className={`my-0.5 items-center break-words rounded-xl bg-slate-400 px-3 py-1 ${
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
  return (
    <div className="flex w-full flex-row items-center p-1 shadow-xl shadow-black">
      <Textarea
        rows={1}
        placeholder="Escribe un mensaje..."
        className="resize-none rounded-full border border-black placeholder:text-slate-800"
      />
      <SendHorizonal className="ml-2 size-9 rounded-full bg-blue-500 stroke-white stroke-1 p-2" />
    </div>
  );
};
