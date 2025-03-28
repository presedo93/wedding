import * as zod from 'zod'
import { eq } from 'drizzle-orm'
import { useForm, type SubmissionResult } from '@conform-to/react'
import { House, ImageUp, LoaderCircle } from 'lucide-react'
import { parseWithZod } from '@conform-to/zod'
import {
  Link,
  redirect,
  useActionData,
  useFetcher,
  useSubmit,
} from 'react-router'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  deleteImage,
  getListFolderImages,
  getSignedImageUrl,
  uploadImage,
} from '~/lib/s3.server'
import { useEffect, useState } from 'react'
import { useMediaQuery } from '~/hooks'
import { motion } from 'motion/react'

type LastResult = SubmissionResult<string[]>

export const schema = zod.object({
  section: zod.string(),
  file: zod.array(
    zod.instanceof(File).refine((f) => /^(image|video)\//.test(f.type)),
    {
      message: 'Solo se permiten imagenes o videos',
    },
  ),
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

  const scopes = user?.scope ?? []
  const images: Record<string, string[]> = {}

  for (const sc of scopes) {
    const list = await getListFolderImages(`pictures/${sc}`)
    const imgs = await Promise.all(list?.map(getSignedImageUrl))
    images[sc] = imgs
  }

  return { images, userId }
}

export default function Photo({ loaderData }: Route.ComponentProps) {
  const { images, userId } = loaderData
  const lastResult = useActionData<typeof action>()

  const submit = useSubmit()
  const [expanded, setExpanded] = useState('')

  const isUser = expanded.includes(userId)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const getHeader = (section: string) => {
    if (section === 'hen') {
      return 'La despedida de la novia'
    }
  }

  const deleteImage = async () => {
    const path = new URL(expanded).pathname.substring(1)

    setExpanded('')
    submit({ img: path }, { action: '/photo', method: 'delete' })
  }

  return (
    <div className="flex min-h-dvh w-full flex-col items-center bg-slate-200 px-8 py-4">
      {expanded && (
        <motion.div
          className={`${!expanded ? 'hidden' : 'absolute'} inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-lg`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {getMedia(expanded) === 'photo' ? (
            <motion.img
              key={expanded}
              src={expanded}
              className="rounded-2xl md:max-h-9/10 md:w-auto"
              initial={{ width: isDesktop ? '20%' : '60%' }}
              animate={{ width: isDesktop ? 'auto' : '90%' }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          ) : (
            <motion.video
              controls
              key={expanded}
              className="rounded-2xl md:max-h-9/10 md:w-auto"
              initial={{ width: isDesktop ? '20%' : '60%' }}
              animate={{ width: isDesktop ? 'auto' : '90%' }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              onCanPlay={(e) => e.currentTarget.play()}
            >
              <motion.source src={expanded} />
            </motion.video>
          )}
          <div className="mt-2 flex w-full flex-row justify-around px-8 md:w-1/3">
            {isUser && (
              <Button
                variant={'destructive'}
                className="w-4/10"
                onClick={deleteImage}
              >
                Borrar
              </Button>
            )}
            <Button className="w-4/10" onClick={() => setExpanded('')}>
              Cerrar
            </Button>
          </div>
        </motion.div>
      )}
      <h1 className="font-playwrite mt-4 text-2xl font-light underline decoration-1 underline-offset-4">
        Las fotos de la boda
      </h1>
      {Object.entries(images).map(([key, images]) => (
        <div key={key}>
          <h3 className="font-playwrite my-4 text-lg font-extralight">
            {getHeader(key)}
          </h3>
          <div className="flex flex-row flex-wrap justify-around gap-2">
            {images.map((img, idx) =>
              getMedia(img) === 'photo' ? (
                <motion.img
                  key={idx}
                  src={img}
                  alt={img}
                  loading="lazy"
                  className="max-h-24 rounded-md"
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpanded(img)
                  }}
                />
              ) : (
                <motion.video
                  key={idx}
                  className="max-h-24 rounded-md"
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpanded(img)
                  }}
                >
                  <source src={img} />
                </motion.video>
              ),
            )}
          </div>
        </div>
      ))}
      <ImageLoader lastResult={lastResult} />
    </div>
  )
}

const ImageLoader = ({ lastResult }: { lastResult?: LastResult }) => {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="fixed top-9/10 flex w-3/5 min-w-min flex-row justify-between gap-x-8 rounded-md px-2 py-1 md:w-1/3">
            <Button className="w-2/3 min-w-min md:w-1/3">
              <ImageUp /> Subir imagen
            </Button>
            <HomeButton />
          </div>
        </DialogTrigger>
        <DialogContent className="bg-slate-300 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sube tus fotos y videos</DialogTitle>
            <DialogDescription>
              ¡Se pueden elegir multiples imágenes o videos!
            </DialogDescription>
          </DialogHeader>
          {lastResult?.error?.scope && (
            <div className="rounded-md bg-red-600 px-2 py-1 text-center text-xs font-semibold text-white">
              No tienes permisos para subir fotos a esta sección
            </div>
          )}
          <div className="p-2 pb-0"></div>
          <ImageForm lastResult={lastResult} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="fixed top-9/10 flex w-3/5 min-w-min flex-row justify-between gap-x-8 rounded-md px-2 py-1 md:w-1/3">
          <Button className="w-2/3 min-w-min md:w-1/3">
            <ImageUp /> Subir imagen
          </Button>
          <HomeButton />
        </div>
      </DrawerTrigger>
      <DrawerContent className="flex items-center bg-slate-300">
        <div className="mx-8 w-4/5">
          <DrawerHeader>
            <DrawerTitle>Sube tus fotos y videos</DrawerTitle>
            <DrawerDescription>
              ¡Se pueden elegir multiples imágenes o videos!
            </DrawerDescription>
          </DrawerHeader>
          {lastResult?.error?.scope && (
            <div className="rounded-md bg-red-600 px-2 py-1 text-center text-xs font-semibold text-white">
              No tienes permisos para subir fotos a esta sección
            </div>
          )}
          <div className="p-4 pb-0"></div>
          <ImageForm lastResult={lastResult} setOpen={setOpen} />
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

const ImageForm = ({
  lastResult,
  setOpen,
}: {
  lastResult?: LastResult
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const fetcher = useFetcher()
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (fetcher.state === 'submitting') {
      setUploading(true)
    } else if (fetcher.state === 'idle') {
      setUploading(false)
    } else if (fetcher.state === 'loading') {
      setOpen(false)
    }
  }, [fetcher.state, setOpen])

  const [form, fields] = useForm({
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema })
    },
  })

  return (
    <fetcher.Form
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
            classTrigger="border border-black"
            classContent="bg-slate-400"
            placeholder="Selecciona una sección"
            meta={fields.section}
            items={[
              { value: 'hen', name: 'La despedida de la novia' },
              { value: 'day', name: 'El día de la boda' },
            ]}
          />
        </div>
      </Field>
      <div className="h-6" />
      <Field>
        <Label htmlFor={fields.file.id}>Imagenes</Label>
        <input
          type="file"
          accept="image/*,video/*"
          placeholder="Selecciona una imagen o video"
          name={fields.file.name}
          multiple
          className="w-full rounded-md border border-black px-2 py-1"
        />
        {fields.file.errors && (
          <FieldError>{Object.values(fields.file.allErrors).flat()}</FieldError>
        )}
      </Field>
      <Button type="submit" className="mt-4 w-full min-w-min self-center">
        {uploading ? (
          <>
            <LoaderCircle className="animate-spin" /> Subiendo...
          </>
        ) : (
          <>Subir</>
        )}
      </Button>
    </fetcher.Form>
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

const getMedia = (signedUrl: string): 'photo' | 'video' => {
  const videoExtensions = new Set(['mp4', 'mov', 'avi', 'mkv', 'webm'])
  const extension = signedUrl.split('.').pop()?.toLowerCase()

  return extension && videoExtensions.has(extension) ? 'video' : 'photo'
}

export const action = async ({ request }: Route.ActionArgs) => {
  const context = await logto.getContext({ getAccessToken: false })(request)

  if (!context.isAuthenticated) {
    return redirect('/auth/sign-in')
  }

  if (request.method === 'POST') {
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
      return {
        status: 'error',
        fields: ['scope'],
        error: { scope: [''] },
      } satisfies SubmissionResult
    }

    const path = `pictures/${submission.value.section}`
    for (const file of submission.value.file) {
      await uploadImage(path, userId, file)
    }
  } else if (request.method === 'DELETE') {
    const form = await request.formData()
    const img = form.get('img') as string

    await deleteImage(img)
  }

  return redirect('/photo')
}
