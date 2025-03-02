import * as zod from 'zod'
import { eq } from 'drizzle-orm'
import { useForm, type SubmissionResult } from '@conform-to/react'
import { House, ImageUp } from 'lucide-react'
import { parseWithZod } from '@conform-to/zod'
import { Form, Link, redirect, useActionData } from 'react-router'

import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Field,
  FieldError,
  Label,
  SelectConform,
} from '~/components'
import { logto } from '~/auth.server'
import { database } from '~/database/context'
import { usersTable } from '~/database/schema'

import type { Route } from './+types/home'

export const schema = zod.object({
  section: zod.string(),
  file: zod
    .array(
      zod.instanceof(File).refine((f) => /^(image|video)\//.test(f.type)),
      {
        message: 'Solo se permiten imagenes o videos',
      },
    )
    .min(1, 'Al menos tienes que seleccionar una imagen'),
})

export async function loader({ request }: Route.LoaderArgs) {
  const context = await logto.getContext({})(request)

  if (!context.isAuthenticated) {
    return redirect('/auth/sign-in')
  }

  const userId = context.claims?.sub ?? ''
  const db = database()

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
  })

  return { scopes: user?.scope ?? [] }
}

export default function Photo() {
  const lastResult = useActionData<typeof action>()

  return (
    <div className="flex min-h-dvh w-full flex-col items-center bg-slate-200 px-8 py-4">
      <h3 className="font-playwrite my-4 text-xl font-extralight">
        La despedida de la novia
      </h3>
      <div className="h-[800px] w-full bg-slate-300" />
      <ImageLoader lastResult={lastResult} />
      <HomeButton />
    </div>
  )
}

type LastResult = SubmissionResult<string[]>

const ImageLoader = ({ lastResult }: { lastResult?: LastResult }) => {
  const [form, fields] = useForm({
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema })
    },
  })

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="fixed top-9/10 w-3/5 min-w-min md:w-1/3">
          <ImageUp /> Subir imagen
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-slate-300">
        <div className="mx-8 w-4/5">
          <DrawerHeader>
            <DrawerTitle>Elige una foto</DrawerTitle>
            <DrawerDescription>
              Se pueden elegir multiples imagenes.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0"></div>
          <Form
            method="post"
            encType="multipart/form-data"
            id={form.id}
            onSubmit={form.onSubmit}
            noValidate
          >
            <Field>
              <Label htmlFor={fields.section.id}>Seccion</Label>
              <div className="flex w-full flex-row items-center justify-center gap-x-6">
                <SelectConform
                  placeholder="Selecciona una sección"
                  meta={fields.section}
                  items={[
                    { value: 'her', name: 'La despedida de la novia' },
                    { value: 'day', name: 'El día de la boda' },
                  ]}
                />
              </div>
            </Field>
            <div className="h-6" />
            <Field>
              <Label htmlFor={fields.file.id}>Imagenes</Label>
              <div className="flex justify-center">
                <input
                  type="file"
                  placeholder="Selecciona una imagen"
                  name={fields.file.name}
                  multiple
                  className="rounded-md border px-2 py-1"
                />
              </div>
              {fields.file.errors && (
                <FieldError>
                  {Object.values(fields.file.allErrors).flat()}
                </FieldError>
              )}
            </Field>
            <Button type="submit" className="mt-4 w-full min-w-min self-center">
              Subir
            </Button>
          </Form>
          <DrawerClose asChild>
            <Button variant="destructive" className="mt-2 mb-4 w-full">
              Cerrar
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

const HomeButton = () => (
  <Link className="flex w-full justify-center" to={'/'}>
    <Button className="w-2/3 min-w-min md:w-1/3">
      <House />
      Página principal
    </Button>
  </Link>
)

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

  const userId = context.claims?.sub ?? ''
  const db = database()

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
  })

  if (!user?.scope.includes(submission.value.section)) {
    return { success: false }
  }

  console.log('FORM IS VALID', formData)
  return { success: true }
}
