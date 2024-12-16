import { eq } from "drizzle-orm";
import { LoaderFunction } from "@remix-run/node";
import { Link, Outlet, redirect, useLoaderData } from "@remix-run/react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Errors, TodoItem } from "~/components";
import { db, User, users } from "~/drizzle";
import { logto } from "~/service/auth.server";

type Loader = {
  readonly user: User;
};

export const loader: LoaderFunction = async ({ request }) => {
  const context = await logto.getContext({ getAccessToken: false })(request);

  if (!context.isAuthenticated) {
    return redirect("/auth/sign-in");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, context.claims!.sub),
  });

  if (!user) {
    return redirect("/auth/sign-in");
  }

  return { user } as Loader;
};

export default function EditProfile() {
  const { user } = useLoaderData<Loader>();

  return (
    <div className="flex min-h-svh flex-col bg-slate-300 px-8 py-4">
      <h1 className="mt-4 text-2xl font-bold">Mi perfil</h1>
      {user && <ProfileCard user={user} />}
      <Outlet />
      <h3 className="mt-2 text-xl font-medium underline decoration-2 underline-offset-4">
        Tareas
      </h3>
      <div className="mt-4 flex flex-col gap-5 rounded-lg bg-slate-500 p-4 shadow shadow-slate-600">
        <ul>
          <TodoItem>Completar el perfil</TodoItem>
          <TodoItem>Anadir acompanantes</TodoItem>
        </ul>
      </div>
      <div className="flex flex-row justify-around">
        <Link className="mt-8 flex justify-center" to={"/"}>
          <Button variant={"destructive"} className="w-2/3 min-w-min">
            Página principal
          </Button>
        </Link>
        <Link className="mt-8 flex justify-center" to={"/profile/edit"}>
          <Button className="w-2/3 min-w-min">Editar perfil</Button>
        </Link>
      </div>
    </div>
  );
}

const ProfileCard = ({ user }: { user: User }) => (
  <div className="mt-4 flex flex-row items-center gap-5 rounded-lg bg-slate-400 p-4 shadow shadow-slate-500">
    <Avatar className="size-14">
      <AvatarImage src={user.pictureUrl || ""} alt="profile" />
      <AvatarFallback>L&R</AvatarFallback>
    </Avatar>
    <p className="mr-4 line-clamp-1 text-ellipsis text-lg">
      Hola, <span className="font-semibold">{user.name}</span>!
    </p>
  </div>
);

export function ErrorBoundary() {
  return <Errors />;
}
