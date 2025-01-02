import { CoverPics, EventTimeline, FullLogo, SecButtons } from "~/components";
import type { Route } from "./+types/home";
import { logto } from "~/auth.server";
import { CountDown } from "~/components/count-down";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Laura & Rene" },
    { name: "description", content: "Our wedding!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const context = await logto.getContext({ getAccessToken: false })(request);
  return { auth: context.isAuthenticated };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { auth } = loaderData;

  return (
    <div className="flex flex-col items-center bg-slate-200">
      <FullLogo className="size-32" />
      <CoverPics />
      <div className="h-8" />
      <CountDown />
      <div className="h-8" />
      <EventTimeline />
      <div className="h-8" />
      <SecButtons isAuth={auth} />
      <div className="h-12" />
    </div>
  );
}
