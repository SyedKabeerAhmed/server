import { buildApp } from './src/app';
import { connectDB } from './src/db';

let ready: Promise<void> | null = null;
async function init(){ ready ||= connectDB().then(() => undefined); return ready; }

const app = buildApp();

// Node.js Server runtime expects a default request handler
export default async function handler(req: any, res: any) {
  await init();
  return (app as any)(req, res);
}
