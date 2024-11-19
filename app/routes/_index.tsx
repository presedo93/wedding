import type { LoaderFunction, MetaFunction } from "@remix-run/node";
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
    <div className="flex h-screen items-center justify-center">
      <span className="font-bold">Hello World!</span>
    </div>
  );
}
