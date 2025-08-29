// server/api/index.ts
import serverless from 'serverless-http';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buildApp } from '../src/app';
import { connectDB } from '../src/db';

let ready: Promise<unknown> | null = null;
async function ensureDB() { ready ||= connectDB(); return ready; }

const app = buildApp();
const handler = serverless(app);

export default async (req: VercelRequest, res: VercelResponse) => {
  await ensureDB();
  // Vercel mounts this function at /api; your Express routes remain /auth, /user, etc.
  return handler(req as any, res as any);
};
