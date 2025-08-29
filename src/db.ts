import mongoose from 'mongoose';
import { config } from './config';

export async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri);
    mongoose.connection.on('error', (e) => {
      console.error('Mongo error', e);
    });
    console.log('Mongo connected');
  } catch (e) {
    console.error('Mongo connect failed', e);
    process.exit(1);
  }
}
