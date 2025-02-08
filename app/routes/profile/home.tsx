import { Avatar, AvatarFallback, AvatarImage, Button } from "~/components/ui";
import { TodoItem } from "~/components";
import { logto } from "~/auth.server";
import { eq } from "drizzle-orm";
import { Link, Outlet, redirect } from "react-router";
import type { Route } from "./+types/home";

import { database } from "~/database/context";
import {
  type Task,
  tasksTable,
  type User,
  usersTable,
} from "~/database/schema";
import { House } from "lucide-react";

interface LogtoUser {
  id: string;
  name: string;
  email: string;
  pictureUrl?: string;
}

export async function loader({ request }: Route.LoaderArgs) {
  const context = await logto.getContext({ fetchUserInfo: true })(request);

  if (!context.isAuthenticated) {
    return redirect("/auth/sign-in");
  }

  const logtoUser = {
    id: context.claims!.sub,
    name: context.claims!.name,
    email: context.claims!.email ?? "",
    pictureUrl: context.claims!.picture,
  } as LogtoUser;

  const db = database();

  let user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, logtoUser.id),
  });

  if (!user) {
    user = (await db.insert(usersTable).values(logtoUser).returning()).at(0);
  }

  const nameChanged = user?.name !== logtoUser.name;
  const pictureChanged = user?.pictureUrl !== logtoUser.pictureUrl;

  if (nameChanged || pictureChanged) {
    user = (
      await db
        .update(usersTable)
        .set(logtoUser)
        .where(eq(usersTable.id, logtoUser.id))
        .returning()
    ).at(0);
  }

  let tasks = await db.query.tasksTable.findFirst({
    where: eq(tasksTable.userId, logtoUser.id),
  });

  if (!tasks) {
    const values = { userId: logtoUser.id };
    tasks = (await db.insert(tasksTable).values(values).returning()).at(0);
  }

  return { user, tasks };
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  const { user, tasks } = loaderData;

  return (
    <div className="flex min-h-svh w-full flex-col items-center bg-slate-200">
      <div className="flex w-full max-w-screen-sm flex-col px-8 py-4">
        <h1 className="mt-4 font-playwrite text-2xl font-light underline decoration-1 underline-offset-4">
          Mi perfil
        </h1>
        {user && <ProfileCard user={user} />}
        <Outlet />
        <UserTasks tasks={tasks!} />
        <UserButtons />
      </div>
    </div>
  );
}

const ProfileCard = ({ user }: { user: User }) => (
  <div className="mt-4 flex flex-row items-center gap-5 rounded-lg bg-slate-400 p-4 shadow shadow-slate-500">
    <Avatar className="size-14">
      <AvatarImage src={user.pictureUrl!} alt="profile" />
      <AvatarFallback>L&R</AvatarFallback>
    </Avatar>
    <p className="mr-4 line-clamp-1 text-ellipsis text-lg">
      Hola, <span className="font-semibold">{user.name}</span>!
    </p>
  </div>
);

type UserTasks = Exclude<
  keyof Task,
  "id" | "updatedAt" | "createdAt" | "deletedAt" | "userId"
>;

const UserTasks = ({ tasks }: { tasks: Task }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, userId, updatedAt, createdAt, deletedAt, ...rest } = tasks;

  return (
    <>
      <h3 className="mt-6 font-playwrite text-xl font-light underline decoration-1 underline-offset-4">
        Tareas
      </h3>
      <div className="mt-4 flex flex-col rounded-lg bg-slate-300 p-4 shadow shadow-slate-400">
        {Object.entries(rest).map(([k, v]) => (
          <TodoItem key={k} name={k as UserTasks} done={v as boolean} />
        ))}
      </div>
    </>
  );
};

const UserButtons = () => (
  <>
    <div className="flex flex-col justify-around">
      <Link className="mt-8 flex w-full justify-center" to={"/"}>
        <Button className="w-2/3 min-w-min md:w-1/3">
          <House />
          Página principal
        </Button>
      </Link>
      <Link className="mt-4 flex w-full justify-center" to={"/auth/sign-out"}>
        <Button variant={"destructive"} className="w-2/3 min-w-min md:w-1/3">
          Cerrar sesión
        </Button>
      </Link>
    </div>
  </>
);
