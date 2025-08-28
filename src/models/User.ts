import { Schema, model } from 'mongoose';

export type Role = 'USER' | 'ADMIN';

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['USER','ADMIN'], default: 'USER' },
  createdAt: { type: Date, default: Date.now },
});

export const User = model('User', userSchema);
