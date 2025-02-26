import * as zod from 'zod'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Form, Link, useActionData, redirect } from 'react-router'

import { logto } from '~/auth.server'
import { Errors, Field, FieldError } from '~/components'
import { InputConform, CheckboxConform, Button, Label } from '~/components/ui'

import { database, guestsTable } from '~/database'
import type { Route } from './+types/new-guest'

export const schema = zod.object({
  name: zod.string().min(1, 'El nombre es necesario'),
  phone: zod
    .string()
    .optional()
    .transform((v) => v?.replace(/\s+/g, '')),
  allergies: zod
    .string()
    .optional()
    .transform((v) => v?.split(',').map((s) => s.trim())),
  isVegetarian: zod.boolean().default(false),
  needsTransport: zod.boolean().default(false),
})

export default function EditGuest() {
  const lastResult = useActionData<typeof action>()

  const [form, fields] = useForm({
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema })
    },
  })

  return (
    <Form method="post" id={form.id} onSubmit={form.onSubmit} noValidate>
      <div className="mt-4 space-y-4">
        <Field>
          <Label htmlFor={fields.name.id}>Nombre</Label>
          <InputConform meta={fields.name} type="text" />
          {fields.name.errors && <FieldError>{fields.name.errors}</FieldError>}
        </Field>

        <Field>
          <Label htmlFor={fields.phone.id}>Num. teléfono</Label>
          <InputConform meta={fields.phone} type="tel" />
          {fields.phone.errors && (
            <FieldError>{fields.phone.errors}</FieldError>
          )}
        </Field>

        <Field>
          <Label htmlFor={fields.allergies.id}>Alergias</Label>
          <InputConform meta={fields.allergies} type="text" />
          {fields.allergies.errors && (
            <FieldError>{fields.allergies.errors}</FieldError>
          )}
        </Field>

        <Field>
          <div className="flex items-center gap-2 rounded-md border border-slate-500 p-2">
            <CheckboxConform meta={fields.isVegetarian} />
            <Label htmlFor={fields.isVegetarian.id}>
              ¿Quieres menu vegetariano?
            </Label>
          </div>
          {fields.isVegetarian.errors && (
            <FieldError>{fields.isVegetarian.errors}</FieldError>
          )}
        </Field>

        <Field>
          <div className="flex items-center gap-2 rounded-md border border-slate-500 p-2">
            <CheckboxConform meta={fields.needsTransport} />
            <Label htmlFor={fields.needsTransport.id}>
              ¿Quieres ir y volver en autobus?
            </Label>
          </div>
          {fields.needsTransport.errors && (
            <FieldError>{fields.needsTransport.errors}</FieldError>
          )}
        </Field>

        <div className="flex flex-row justify-center space-x-3">
          <Link className="w-1/2" to={'/profile'}>
            <Button variant={'destructive'} className="w-full min-w-min">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" className="w-1/2 min-w-min">
            Guardar
          </Button>
        </div>
      </div>
    </Form>
  )
}

export const action = async ({ request }: Route.ActionArgs) => {
  const context = await logto.getContext({ getAccessToken: false })(request)

  if (!context.isAuthenticated) {
    return redirect('/auth/sign-in')
  }

  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  const db = database()
  const userId = context.claims?.sub ?? ''

  await db.insert(guestsTable).values({ userId, ...submission.value })
  return redirect('/profile')
}

export function ErrorBoundary() {
  return <Errors />
}
