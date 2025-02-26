import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const { STORAGE_S3_ACCESS, STORAGE_S3_SECRET, STORAGE_S3_BUCKET } = process.env

if (!STORAGE_S3_ACCESS || !STORAGE_S3_SECRET || !STORAGE_S3_BUCKET) {
  throw new Error('Missing S3 environment variables')
}

export const s3 = new S3Client({
  endpoint: 'https://nbg1.your-objectstorage.com',
  region: 'nbg1',
  credentials: {
    accessKeyId: STORAGE_S3_ACCESS,
    secretAccessKey: STORAGE_S3_SECRET,
  },
})

export async function getSignedImageUrl(path: string) {
  const command = new GetObjectCommand({
    Bucket: STORAGE_S3_BUCKET,
    Key: `${path}`,
  })

  return getSignedUrl(s3, command, { expiresIn: 3600 })
}

export async function uploadImage(path: string, file: File) {
  const { name, type } = file
  const buffer = await file.arrayBuffer()

  const command = new PutObjectCommand({
    Bucket: STORAGE_S3_BUCKET,
    Key: `${path}/${name}`,
    Body: Buffer.from(buffer),
    ContentType: type,
  })

  await s3.send(command)
  return name
}

export async function deleteImage(path: string) {
  const command = new DeleteObjectCommand({
    Bucket: STORAGE_S3_BUCKET,
    Key: `${path}`,
  })

  await s3.send(command)
}
