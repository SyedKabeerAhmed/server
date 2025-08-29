import mongoose from 'mongoose';

type GlobalWithMongoose = typeof globalThis & {
  __mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};
const g = globalThis as GlobalWithMongoose;
g.__mongoose ||= { conn: null, promise: null };

export async function connectDB() {
  if (g.__mongoose!.conn) return g.__mongoose!.conn;
  if (!g.__mongoose!.promise) {
    const uri = process.env.MONGO_URI!;
    g.__mongoose!.promise = mongoose.connect(uri, { maxPoolSize: 5 });
  }
  g.__mongoose!.conn = await g.__mongoose!.promise;
  return g.__mongoose!.conn;
}
