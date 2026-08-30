import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export const runtime = 'nodejs';

const sanitizeSegment = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);

export async function POST(request) {
  const uploadSecret = process.env.R2_UPLOAD_SECRET || process.env.KEYSTATIC_SECRET;
  const authHeader = request.headers.get('authorization') || '';

  if (!uploadSecret) {
    return Response.json({ error: 'R2_UPLOAD_SECRET is not configured.' }, { status: 500 });
  }

  if (authHeader !== `Bearer ${uploadSecret}`) {
    return Response.json({ error: 'Unauthorized upload.' }, { status: 401 });
  }

  const { R2_BUCKET, R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_PUBLIC_URL } = process.env;

  if (!R2_BUCKET || !R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_PUBLIC_URL) {
    return Response.json({ error: 'R2 environment variables are incomplete.' }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const folder = sanitizeSegment(String(formData.get('folder') || 'studio'));
  const requestedName = sanitizeSegment(String(formData.get('filename') || ''));

  if (!(file instanceof File)) {
    return Response.json({ error: 'Missing file.' }, { status: 400 });
  }

  const originalName = sanitizeSegment(file.name || 'asset');
  const extension = originalName.includes('.') ? originalName.split('.').pop() : '';
  const baseName = requestedName || originalName.replace(/\.[^.]+$/, '') || 'asset';
  const key = `${folder}/${Date.now()}-${baseName}${extension ? `.${extension}` : ''}`;

  const client = new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });

  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: new Uint8Array(await file.arrayBuffer()),
      ContentType: file.type || 'application/octet-stream',
    }),
  );

  return Response.json({
    key,
    url: `${R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`,
    contentType: file.type || 'application/octet-stream',
    size: file.size,
  });
}
