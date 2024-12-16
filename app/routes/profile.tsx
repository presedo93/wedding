import { LoaderFunction } from "@remix-run/node";
import { Link, Outlet, redirect, useLoaderData } from "@remix-run/react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Errors, TodoItem } from "~/components";
import { logto } from "~/service/auth.server";
import { UserInfoResponse } from "@logto/remix";

type Loader = {
  readonly user: UserInfoResponse;
};

export const loader: LoaderFunction = async ({ request }) => {
  const context = await logto.getContext({ fetchUserInfo: true })(request);

  if (!context.isAuthenticated) {
    return redirect("/auth/sign-in");
  }

  return { user: context.userInfo } as Loader;
};

export default function EditProfile() {
  const { user } = useLoaderData<Loader>();

  return (
    <div className="flex min-h-svh flex-col bg-slate-200 px-8 py-4">
      <h1 className="mt-4 text-2xl font-semibold underline decoration-2 underline-offset-4">
        Mi perfil
      </h1>
      {user && <ProfileCard user={user} />}
      <Outlet />
      <UserTasks />
      <UserButtons />
    </div>
  );
}

const ProfileCard = ({ user }: { user: UserInfoResponse }) => (
  <div className="mt-4 flex flex-row items-center gap-5 rounded-lg bg-slate-400 p-4 shadow shadow-slate-500">
    <Avatar className="size-14">
      <AvatarImage src={user.picture || ""} alt="profile" />
      <AvatarFallback>L&R</AvatarFallback>
    </Avatar>
    <p className="mr-4 line-clamp-1 text-ellipsis text-lg">
      Hola, <span className="font-semibold">{user.name || user.username}</span>!
    </p>
  </div>
);

const UserTasks = () => (
  <>
    <h3 className="mt-2 text-xl font-medium underline decoration-2 underline-offset-4">
      Tareas
    </h3>
    <div className="mt-4 flex flex-col gap-5 rounded-lg bg-slate-300 p-4 shadow shadow-slate-400">
      <ul>
        <TodoItem isChecked={true}>Completa tu perfil.</TodoItem>
        <TodoItem isChecked={false}>Añade a tus acompañantes.</TodoItem>
        <TodoItem isChecked={false}>Elige tus canciones favoritas.</TodoItem>
        <TodoItem isChecked={false}>Deja algún mensaje.</TodoItem>
        <TodoItem isChecked={false}>Sube tus fotos del día!</TodoItem>
      </ul>
    </div>
  </>
);

const UserButtons = () => (
  <>
    <div className="flex flex-row justify-around">
      <Link className="mt-8 flex w-full justify-center" to={"/"}>
        <Button className="w-10/12 min-w-min">Página principal</Button>
      </Link>
      <Link className="mt-8 flex w-full justify-center" to={"/profile/edit"}>
        <Button className="w-10/12 min-w-min">Editar perfil</Button>
      </Link>
    </div>
    <Link className="mt-8 flex w-full justify-center" to={"/auth/sign-out"}>
      <Button variant={"destructive"} className="w-2/3 min-w-min">
        Cerrar sesión
      </Button>
    </Link>
  </>
);

export function ErrorBoundary() {
  return <Errors />;
}
