import * as zod from "zod";
import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs, LoaderFunction, redirect } from "@remix-run/node";
import { Link, Form, useActionData, useLoaderData } from "@remix-run/react";

import { InputConform } from "~/components/conform";
import { Button, Label } from "~/components/ui";
import { Errors, Field, FieldError } from "~/components";
import { useForm } from "@conform-to/react";
import { logto } from "~/service/auth.server";
import { UserInfoResponse } from "@logto/remix";

export const schema = zod.object({
  name: zod.string().min(1, "El nombre es necesario"),
  primaryPhone: zod
    .string()
    .optional()
    .transform((v) => v?.replace(/\s+/g, "")),
});

type Loader = {
  readonly user: UserInfoResponse;
};

export const loader: LoaderFunction = async ({ request }) => {
  const context = await logto.getContext({ fetchUserInfo: true })(request);

  if (!context.isAuthenticated) {
    return redirect("/auth/sign-in");
  }

  return { user: context.userInfo } as Loader;
};

export default function NewProfile() {
  const { user } = useLoaderData<Loader>();
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
          <Link className="w-1/2" to={"/profile/info"}>
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

export const action = async ({ request }: ActionFunctionArgs) => {
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

  return redirect("/profile/info");
};

export function ErrorBoundary() {
  return <Errors />;
}
