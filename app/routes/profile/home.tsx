import { Avatar, AvatarFallback, AvatarImage, Button } from "~/components/ui";
import { TodoItem } from "~/components";
import { logto } from "~/auth.server";
import { eq } from "drizzle-orm";
import { Link, Outlet, redirect } from "react-router";
import type { Route } from "./+types/home";

import { database } from "~/database/context";
import { type Task, tasksTable } from "~/database/schema";

interface UserInfo {
  name?: string;
  username?: string;
  picture?: string;
}

export async function loader({ request }: Route.LoaderArgs) {
  const context = await logto.getContext({ fetchUserInfo: true })(request);

  if (!context.isAuthenticated) {
    return redirect("/auth/sign-in");
  }

  let user = {
    name: context.claims!.name,
    username: context.claims!.username,
    picture: context.claims!.picture,
  } as UserInfo;

  const db = database();
  const id = context.claims!.sub;

  let tasks = await db.query.tasksTable.findFirst({
    where: eq(tasksTable.id, id),
  });

  if (!tasks) {
    tasks = (await db.insert(tasksTable).values({ id }).returning()).at(0);
  }

  return { user, tasks };
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  const { user, tasks } = loaderData;

  return (
    <div className="flex min-h-svh flex-col bg-slate-200 px-8 py-4">
      <h1 className="mt-4 text-2xl font-semibold underline decoration-2 underline-offset-4">
        Mi perfil
      </h1>
      {user && <ProfileCard user={user} />}
      <Outlet />
      <UserTasks tasks={tasks!} />
      <UserButtons />
    </div>
  );
}

const ProfileCard = ({ user }: { user: UserInfo }) => (
  <div className="mt-4 flex flex-row items-center gap-5 rounded-lg bg-slate-400 p-4 shadow shadow-slate-500">
    <Avatar className="size-14">
      <AvatarImage src={user.picture!} alt="profile" />
      <AvatarFallback>L&R</AvatarFallback>
    </Avatar>
    <p className="mr-4 line-clamp-1 text-ellipsis text-lg">
      Hola, <span className="font-semibold">{user.name || user.username}</span>!
    </p>
  </div>
);

const UserTasks = ({ tasks }: { tasks: Task }) => {
  const { id, ...rest } = tasks;

  return (
    <>
      <h3 className="mt-2 text-xl font-medium underline decoration-2 underline-offset-4">
        Tareas
      </h3>
      <div className="mt-4 flex flex-col rounded-lg bg-slate-300 p-4 shadow shadow-slate-400">
        {Object.entries(rest).map(([k, v]) => (
          <TodoItem
            key={k}
            name={k as Exclude<keyof Task, "id">}
            done={v as boolean}
          />
        ))}
      </div>
    </>
  );
};

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
