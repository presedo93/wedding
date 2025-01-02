import { redirect } from "react-router";
import { eq } from "drizzle-orm";

import { logto } from "~/auth.server";
import type { Route } from "./+types/edit-tasks";

import { database } from "~/database/context";
import { type Task, tasksTable } from "~/database/schema";

type FormType = {
  [key in Exclude<keyof Task, "id">]?: string;
};

export const action = async ({ request }: Route.ActionArgs) => {
  const context = await logto.getContext({ getAccessToken: false })(request);

  if (!context.isAuthenticated) {
    return redirect("/auth/sign-in");
  }

  const db = database();
  const form = await request.formData();

  const data: FormType = Object.fromEntries(form.entries());
  const parsed = Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, Boolean(v)])
  );

  await db
    .update(tasksTable)
    .set(parsed)
    .where(eq(tasksTable.id, context.claims!.sub));

  return redirect("/profile");
};
