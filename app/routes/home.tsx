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
      <div className="h-8 sm:h-12" />
      <SmallCover />
      <MediumCover />
      <div className="h-8 sm:h-16" />
      <EventTimeline />
      <div className="h-8" />
      <SecButtons isAuth={auth} />
      <div className="h-12" />
    </div>
  );
}

const SmallCover = () => (
  <div className="block sm:hidden px-4">
    <div className="flex flex-col items-center justify-between">
      <FullLogo />
      <div className="h-8" />
      <CoverPics />
      <div className="h-8" />
      <CountDown />
    </div>
  </div>
);

const MediumCover = () => (
  <div className="max-w-[1024px] w-full hidden sm:block px-4">
    <div className="flex flex-row items-center justify-around">
      <CoverPics />
      <div className="w-2/5 flex flex-col items-center justify-between">
        <FullLogo />
        <div className="h-8" />
        <CountDown />
      </div>
    </div>
  </div>
);
