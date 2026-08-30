import { ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export const runtime = 'nodejs';

const sanitizeSegment = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);

function getR2Config() {
  const { R2_BUCKET, R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_PUBLIC_URL } = process.env;

  if (!R2_BUCKET || !R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_PUBLIC_URL) {
    return { error: 'R2 environment variables are incomplete.' };
  }

  return { R2_BUCKET, R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_PUBLIC_URL };
}

function getClient(config) {
  return new S3Client({
    region: 'auto',
    endpoint: config.R2_ENDPOINT,
    credentials: {
      accessKeyId: config.R2_ACCESS_KEY_ID,
      secretAccessKey: config.R2_SECRET_ACCESS_KEY,
    },
  });
}

function assertUploaderSecret(request) {
  const uploadSecret = process.env.R2_UPLOAD_SECRET || process.env.KEYSTATIC_SECRET;
  const authHeader = request.headers.get('authorization') || '';

  if (!uploadSecret) {
    return Response.json({ error: 'R2_UPLOAD_SECRET is not configured.' }, { status: 500 });
  }

  if (authHeader !== `Bearer ${uploadSecret}`) {
    return Response.json({ error: 'Unauthorized upload.' }, { status: 401 });
  }

  return null;
}

export async function GET(request) {
  const unauthorized = assertUploaderSecret(request);
  if (unauthorized) return unauthorized;

  const config = getR2Config();
  if (config.error) return Response.json({ error: config.error }, { status: 500 });

  const { searchParams } = new URL(request.url);
  const prefix = sanitizeSegment(String(searchParams.get('prefix') || ''));
  const maxKeys = Math.min(Number(searchParams.get('limit') || 60), 100);
  const response = await getClient(config).send(
    new ListObjectsV2Command({
      Bucket: config.R2_BUCKET,
      Prefix: prefix ? `${prefix}/` : undefined,
      MaxKeys: Number.isFinite(maxKeys) ? maxKeys : 60,
    }),
  );

  const publicBase = config.R2_PUBLIC_URL.replace(/\/$/, '');

  return Response.json({
    objects: (response.Contents || [])
      .filter((item) => item.Key)
      .map((item) => ({
        key: item.Key,
        url: `${publicBase}/${item.Key}`,
        size: item.Size || 0,
        lastModified: item.LastModified?.toISOString() || null,
      })),
  });
}

export async function POST(request) {
  const unauthorized = assertUploaderSecret(request);
  if (unauthorized) return unauthorized;

  const config = getR2Config();
  if (config.error) return Response.json({ error: config.error }, { status: 500 });

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

  await getClient(config).send(
    new PutObjectCommand({
      Bucket: config.R2_BUCKET,
      Key: key,
      Body: new Uint8Array(await file.arrayBuffer()),
      ContentType: file.type || 'application/octet-stream',
    }),
  );

  return Response.json({
    key,
    url: `${config.R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`,
    contentType: file.type || 'application/octet-stream',
    size: file.size,
  });
}
