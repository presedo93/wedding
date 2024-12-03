import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { CoverPics, EventTimeline, SecButtons } from "~/components";
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
  return (
    <div className="flex flex-col items-center bg-slate-200">
      <FullLogo className="size-24" />
      <CoverPics />
      <div className="h-8" />
      <EventTimeline />
      <div className="h-8" />
      <SecButtons />
      <div className="h-12" />
    </div>
  );
}
