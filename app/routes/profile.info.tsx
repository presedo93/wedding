import { LoaderFunction } from "@remix-run/node";
import { Link, redirect, useLoaderData } from "@remix-run/react";
import { GuestCard } from "~/components";
import { Button } from "~/components/ui/button";
import { db, Guest, guests } from "~/drizzle";
import { eq } from "drizzle-orm";
import { logto } from "~/service/auth.server";

type Loader = {
  readonly userGuests: Guest[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const context = await logto.getContext({ getAccessToken: false })(request);

  if (!context.isAuthenticated) {
    return redirect("/auth/sign-in");
  }

  const userGuests = await db.query.guests.findMany({
    where: eq(guests.userId, context.claims!.sub),
  });

  return { userGuests } as Loader;
};

export default function Guests() {
  const { userGuests } = useLoaderData<Loader>();

  return (
    <>
      <h3 className="mt-6 text-xl font-medium underline decoration-2 underline-offset-4">
        Acompanantes
      </h3>
      <div className="my-2 flex flex-col items-center justify-center">
        {userGuests.length ? <GuestsList guests={userGuests} /> : <NoGuests />}
      </div>
      <Link className="flex w-full justify-center" to={"/profile/new-guest"}>
        <Button className="w-2/3 min-w-min">Nuevo acompanante</Button>
      </Link>
    </>
  );
}

const GuestsList = ({ guests }: { guests: Guest[] }) => {
  return guests.map((g, i) => <GuestCard guest={g} key={i} />);
};

const NoGuests = () => (
  <span className="my-6 text-sm">No has anadido ningun acompanate aun!</span>
);

// export function ErrorBoundary() {
//   return <Errors />;
// }
