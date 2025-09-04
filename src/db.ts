import mongoose from 'mongoose';
import { config } from './config';

export async function connectDB() {
  try {
    const uri = config.mongoUri?.trim();
    const sourceVar = process.env.MONGO_URI ? 'MONGO_URI' : (process.env.MONGODB_URI ? 'MONGODB_URI' : 'none');
    // Safe debug: log which variable was used and basic URI parts without secrets
    try {
      if (uri) {
        const redacted = (() => {
          try {
            const u = new URL(uri.replace('mongodb+srv://', 'http://').replace('mongodb://', 'http://'));
            const host = u.host ? u.host.split('@').pop() : '';
            return `${uri.startsWith('mongodb+srv://') ? 'mongodb+srv' : uri.startsWith('mongodb://') ? 'mongodb' : 'unknown'}://${host || 'unknown-host'}`;
          } catch { return 'unparseable-uri'; }
        })();
        console.log(`Mongo config: source=${sourceVar}, preview=${redacted}`);
      } else {
        console.log(`Mongo config: source=${sourceVar}, preview=empty`);
      }
    } catch {}
    if (!uri) {
      console.error('Mongo connect failed: MONGO_URI/MONGODB_URI is not set');
      throw new Error('Missing Mongo connection string (MONGO_URI or MONGODB_URI).');
    }
    const isValidScheme = uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://');
    if (!isValidScheme) {
      console.error('Mongo connect failed: invalid URI scheme. Expected mongodb:// or mongodb+srv://');
      throw new Error('Invalid Mongo URI scheme. Must start with mongodb:// or mongodb+srv://');
    }

    await mongoose.connect(uri);
    mongoose.connection.on('error', (e) => {
      console.error('Mongo error', e);
    });
    console.log('Mongo connected');
  } catch (e) {
    console.error('Mongo connect failed', e);
    process.exit(1);
  }
}
