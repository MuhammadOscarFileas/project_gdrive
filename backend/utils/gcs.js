import { Storage } from '@google-cloud/storage';

// Konfigurasi storage, pastikan GOOGLE_APPLICATION_CREDENTIALS sudah di-set ke path file credentials json
const storage = new Storage();
const bucketName = process.env.GCS_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

export async function uploadToGCS(buffer, filename) {
  const file = bucket.file(filename);
  await file.save(buffer);
  return file.name; // path di bucket
}

export async function deleteFromGCS(gcsPath) {
  const file = bucket.file(gcsPath);
  await file.delete();
}

export async function getSignedUrlGCS(gcsPath, action = 'read') {
  const file = bucket.file(gcsPath);
  const expires = Date.now() + 1000 * 60 * 10; // 10 menit
  const [url] = await file.getSignedUrl({
    action: action === 'download' ? 'download' : 'read',
    expires,
  });
  return url;
} 