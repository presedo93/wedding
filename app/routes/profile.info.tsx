import { LoaderFunction } from "@remix-run/node";
import { Link, redirect, useLoaderData } from "@remix-run/react";
import { Errors, GuestCard } from "~/components";
import { Button } from "~/components/ui/button";
import { db, Guest, guestsTable } from "~/drizzle";
import { eq } from "drizzle-orm";
import { logto } from "~/service/auth.server";
import { Reorder } from "motion/react";
import { useState } from "react";

type Loader = {
  readonly guests: Guest[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const context = await logto.getContext({})(request);

  if (!context.isAuthenticated) {
    return redirect("/auth/sign-in");
  }

  const guests = await db.query.guestsTable.findMany({
    where: eq(guestsTable.userId, context.claims!.sub),
  });

  return { guests } as Loader;
};

export default function Guests() {
  const { guests } = useLoaderData<Loader>();
  const [guestsList, setGuestsList] = useState(guests);

  return (
    <>
      <h3 className="mt-6 text-xl font-medium underline decoration-2 underline-offset-4">
        Acompañantes
      </h3>
      <div className="my-2 flex flex-col items-center justify-center">
        {guests.length ? (
          <GuestsList guests={guestsList} onReorder={setGuestsList} />
        ) : (
          <NoGuests />
        )}
      </div>
      <Link className="flex w-full justify-center" to={"/profile/new-guest"}>
        <Button className="w-2/3 min-w-min">Nuevo acompanante</Button>
      </Link>
    </>
  );
}

const GuestsList = ({
  guests,
  onReorder,
}: {
  guests: Guest[];
  onReorder: React.Dispatch<React.SetStateAction<Guest[]>>;
}) => {
  return (
    <Reorder.Group
      axis="y"
      values={guests}
      onReorder={onReorder}
      className="w-full"
    >
      {guests.map((g) => (
        <GuestCard guest={g} key={g.id} />
      ))}
    </Reorder.Group>
  );
};

const NoGuests = () => (
  <div className="my-6 text-center text-sm">
    <p>No has añadido ningun acompañante aún!</p>
    <p className="text-slate-500">(Recuerda añadirte a ti también)</p>
  </div>
);

export function ErrorBoundary() {
  return <Errors />;
}
