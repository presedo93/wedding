import fs from 'fs'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

const bucketName = process.env.STORAGE_S3_BUCKET || ''
const bucketAccess = process.env.STORAGE_S3_ACCESS || ''
let bucketSecret = process.env.STORAGE_S3_SECRET || ''

if (process.env.NODE_ENV === 'production') {
  const path = process.env.STORAGE_S3_SECRET || '/run/secrets/hetzner-secret'

  try {
    bucketSecret = fs.readFileSync(path, 'utf8').trim()
  } catch {
    throw new Error('Missing STORAGE_S3_SECRET secret')
  }
}

if (!bucketAccess || !bucketSecret || !bucketName) {
  throw new Error('Missing S3 environment variables')
}

export const s3 = new S3Client({
  endpoint: 'https://nbg1.your-objectstorage.com',
  region: 'nbg1',
  credentials: {
    accessKeyId: bucketAccess,
    secretAccessKey: bucketSecret,
  },
})

export async function getSignedImageUrl(path: string) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: `${path}`,
    ResponseCacheControl: 'public, max-age=31536000',
  })

  return getSignedUrl(s3, command, { expiresIn: 3600 })
}

export async function getListFolderImages(path: string) {
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: `${path}`,
  })

  const output = await s3.send(command)
  return (
    output?.Contents?.flatMap((o) => (o.Key !== undefined ? [o.Key] : [])) ?? []
  )
}

export async function uploadImage(path: string, userId: string, file: File) {
  const { name, type } = file
  const buffer = await file.arrayBuffer()

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: `${path}/${userId}_${name}`,
    Body: Buffer.from(buffer),
    ContentType: type,
  })

  await s3.send(command)
  return name
}

export async function deleteImage(path: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: `${path}`,
  })

  await s3.send(command)
}
