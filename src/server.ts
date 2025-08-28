import { buildApp } from './app';
import { connectDB } from './db';
import { config } from './config';

async function start() {
  await connectDB();
  const app = buildApp();
  app.listen(config.port, () => {
    console.log(`API on :${config.port}`);
  });
}

process.on('unhandledRejection', (e) => {
  console.error('unhandledRejection', e);
});
process.on('uncaughtException', (e) => {
  console.error('uncaughtException', e);
  process.exit(1);
});

start();
