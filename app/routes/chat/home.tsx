import { Button } from "~/components";
import type { Route } from "./+types/home";
import { Link } from "react-router";
import { House } from "lucide-react";

export async function loader() {
  const message = "Hello, world!";
  return { message };
}

export default function Music({ loaderData }: Route.ComponentProps) {
  const { message } = loaderData;

  return (
    <div className="flex min-h-svh w-full flex-col items-center bg-slate-200">
      <div className="flex w-full max-w-screen-sm flex-col px-8 py-4">
        {message}
        <Buttons />
      </div>
    </div>
  );
}

const Buttons = () => (
  <div className="flex flex-col justify-around">
    <Link className="mt-8 flex w-full justify-center" to={"/"}>
      <Button className="w-2/3 min-w-min md:w-1/3">
        <House />
        Página principal
      </Button>
    </Link>
  </div>
);
