import { Storage } from '@google-cloud/storage';

// Parsing credentials dari BASE64 environment variable
const base64Creds = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;

if (!base64Creds) {
  throw new Error("Missing GOOGLE_APPLICATION_CREDENTIALS_BASE64 env var");
}

const credentials = JSON.parse(
  Buffer.from(base64Creds, "base64").toString("utf-8")
);

// Inisialisasi Storage client dengan credentials dari base64
const storage = new Storage({
  projectId: credentials.project_id,
  credentials: {
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  },
});

const bucketName = process.env.GCS_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

// === FUNCTIONS ===

export async function uploadToGCS(buffer, filename) {
  const file = bucket.file(filename);
  await file.save(buffer);
  return file.name;
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
