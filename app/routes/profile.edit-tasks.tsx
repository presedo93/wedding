import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { eq } from "drizzle-orm";
import { db, Task, tasksTable } from "~/drizzle";
import { logto } from "~/service/auth.server";

type FormType = {
  [key in Exclude<keyof Task, "id">]?: boolean;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const context = await logto.getContext({ getAccessToken: false })(request);

  if (!context.isAuthenticated) {
    return redirect("/auth/sign-in");
  }

  const form = await request.formData();
  const data: FormType = Object.fromEntries(form.entries());

  await db
    .update(tasksTable)
    .set(data)
    .where(eq(tasksTable.id, context.claims!.sub));

  return redirect("/profile/info");
};
