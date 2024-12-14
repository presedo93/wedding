import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { eq } from "drizzle-orm";
import { db, guests } from "~/drizzle";
import { logto } from "~/service/auth.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const context = await logto.getContext({ getAccessToken: false })(request);

  if (!context.isAuthenticated) {
    return redirect("/auth/sign-in");
  }

  await db.delete(guests).where(eq(guests.id, Number(params.id)));
  return redirect("/profile/info");
};
