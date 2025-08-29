// server/api/[...all].ts
import serverless from 'serverless-http';
import { buildApp } from '../src/app';
import { connectDB } from '../src/db';

let ready: Promise<void> | null = null;
async function init() {
  if (!ready) ready = connectDB().then(() => undefined);
  return ready;
}

const app = buildApp();
const handler = serverless(app);

export default async function (req: any, res: any) {
  await init();
  return handler(req, res); // Express handles /auth, /user, /currency, /admin
}
