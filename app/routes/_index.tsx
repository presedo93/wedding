import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CoverPics, EventTimeline, SecButtons } from "~/components";
import { CountDown } from "~/components/count-down";
import { FullLogo } from "~/components/logos/full-logo";
import { logto } from "~/service/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Laura & Rene" },
    { name: "description", content: "Our wedding!" },
  ];
};

type LoaderResponse = {
  readonly auth: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const context = await logto.getContext({ getAccessToken: false })(request);
  return { auth: context.isAuthenticated } as LoaderResponse;
};

export default function Index() {
  const { auth } = useLoaderData<LoaderResponse>();

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
