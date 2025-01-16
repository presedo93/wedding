import { SpotifySearch } from "~/components";
import type { Route } from "./+types/home";
import { redirect } from "react-router";
import { logto } from "~/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  const context = await logto.getContext({ fetchUserInfo: true })(request);

  if (!context.isAuthenticated) {
    return redirect("/auth/sign-in");
  }
}

// 5IEF5Mz3jySl3Jn01Qm3fd
export default function Music({}: Route.ComponentProps) {
  return (
    <div className="flex min-h-svh flex-col bg-slate-300 px-8 py-4">
      <h1 className="font-playwrite self-center mt-4 text-2xl font-semibold">
        La música de la boda
      </h1>
      <div className="mt-4 p-3 bg-sky-900 rounded-xl flex flex-col">
        <SpotifySearch />
        <div className="mt-4 bg-slate-300 h-px w-11/12 self-center" />
        <div className="h-96" />
      </div>
    </div>
  );
}
