import * as zod from "zod";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Link, Form, useActionData, redirect } from "react-router";

import { logto } from "~/auth.server";
import { Errors, Field, FieldError } from "~/components";
import { Button, Label, InputConform } from "~/components/ui";
import type { Route } from "./+types/edit";

interface UserInfo {
  name?: string;
  username?: string;
  picture?: string;
  phone_number?: string;
}

export const schema = zod.object({
  name: zod.string().min(1, "El nombre es necesario"),
  primaryPhone: zod
    .string()
    .optional()
    .transform((v) => v?.replace(/\s+/g, "")),
});

export async function loader({ request }: Route.LoaderArgs) {
  const context = await logto.getContext({ fetchUserInfo: true })(request);

  if (!context.isAuthenticated) {
    return redirect("/auth/sign-in");
  }

  let user = {
    name: context.claims!.name,
    username: context.claims!.username,
    picture: context.claims!.picture,
    phone_number: context.claims!.phone_number,
  } as UserInfo;

  return { user };
}

export default function NewProfile({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const lastResult = useActionData<typeof action>();

  const [form, fields] = useForm({
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: {
      name: user.name ?? "",
      primaryPhone: user.phone_number ?? "",
    },
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <Form method="post" id={form.id} onSubmit={form.onSubmit} noValidate>
      <div className="mt-4 space-y-4">
        <Field>
          <Label htmlFor={fields.name.id}>Nombre</Label>
          <InputConform meta={fields.name} type="text" />
          {fields.name.errors && <FieldError>{fields.name.errors}</FieldError>}
        </Field>

        <Field>
          <Label htmlFor={fields.primaryPhone.id}>Num. teléfono</Label>
          <InputConform meta={fields.primaryPhone} type="tel" />
          {fields.primaryPhone.errors && (
            <FieldError>{fields.primaryPhone.errors}</FieldError>
          )}
        </Field>

        <div className="flex flex-row justify-center space-x-3">
          <Link className="w-1/2" to={"/profile"}>
            <Button variant={"destructive"} className="w-full min-w-min">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" className="w-1/2 min-w-min">
            Guardar
          </Button>
        </div>
      </div>
    </Form>
  );
}

export async function action({ request }: Route.ActionArgs) {
  const context = await logto.getContext({ getAccessToken: true })(request);

  if (!context.isAuthenticated) {
    return redirect("/auth/sign-in");
  }

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await fetch(`${process.env.LOGTO_ENDPOINT}/api/my-account`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${context.accessToken}`,
    },
    body: JSON.stringify(submission.value),
  });

  return redirect("/profile");
}

export function ErrorBoundary() {
  return <Errors />;
}
