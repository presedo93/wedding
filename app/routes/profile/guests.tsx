import { Link, redirect } from "react-router";
import { eq } from "drizzle-orm";
import { Reorder } from "motion/react";
import { useState } from "react";

import { GuestCard } from "~/components";
import { Button } from "~/components/ui";
import { logto } from "~/auth.server";

import type { Route } from "./+types/guests";
import { database } from "~/database/context";
import { type Guest, guestsTable } from "~/database/schema";

export async function loader({ request }: Route.LoaderArgs) {
  const context = await logto.getContext({})(request);

  if (!context.isAuthenticated) {
    return redirect("/auth/sign-in");
  }

  const db = database();
  const guests = await db.query.guestsTable.findMany({
    where: eq(guestsTable.userId, context.claims!.sub),
  });

  return { guests };
}

export default function ProfileInfo({ loaderData }: Route.ComponentProps) {
  const { guests } = loaderData;
  const [guestsList, setGuestsList] = useState(guests);

  return (
    <>
      <h3 className="mt-6 text-xl font-playwrite font-light underline decoration-1 underline-offset-4">
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
        <Button className="w-2/3 md:w-1/3 min-w-min">Nuevo acompanante</Button>
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
