import { Form } from "@remix-run/react";
import { Bus, Phone, Salad, Trash2, WheatOff } from "lucide-react";
import { Guest } from "~/drizzle";

interface Props {
  guest: Guest;
}

export function GuestCard({ guest }: Props) {
  return (
    <div className="my-1 flex w-full flex-row gap-1 rounded-md bg-slate-400 py-1 pl-6 shadow shadow-slate-500">
      <div className="flex w-5/6 flex-col gap-[0.5px]">
        <h2 className="text-xl font-semibold">{guest.name}</h2>
        {guest.phone && (
          <p className="flex flex-row items-center gap-2 text-sm italic text-slate-700">
            <Phone className="size-4" />
            {guest.phone}
          </p>
        )}
        {guest.allergies?.length > 0 && (
          <p className="flex flex-row items-center gap-2 text-sm italic text-slate-700">
            <WheatOff className="size-4" />
            {guest.allergies.join(", ")}
          </p>
        )}
        {guest.isVegetarian && (
          <p className="flex flex-row items-center gap-2 text-sm italic text-slate-700">
            <Salad className="size-4" />
            Menú vegetariano
          </p>
        )}
        {guest.needsTransport && (
          <p className="flex flex-row items-center gap-2 text-sm italic text-slate-700">
            <Bus className="size-4" />
            Usa autobus
          </p>
        )}
      </div>
      <div className="flex w-1/6 items-center justify-center">
        <DeleteGuest id={guest.id} />
      </div>
    </div>
  );
}

function DeleteGuest({ id }: { id: number }) {
  return (
    <Form action={`/profile/delete-guest/${id}`} method="delete">
      <button type="submit">
        <Trash2 className="size-6 stroke-red-700 stroke-2" />
      </button>
    </Form>
  );
}
