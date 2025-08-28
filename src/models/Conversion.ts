import { Schema, model, Types } from 'mongoose';

const conversionSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  from: String,
  to: String,
  amount: Number,
  rate: Number,
  result: Number,
  createdAt: { type: Date, default: Date.now },
});

export const Conversion = model('Conversion', conversionSchema);
