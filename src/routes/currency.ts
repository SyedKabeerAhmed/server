import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { asyncH } from '../utils/async';
import { getCurrencies, getLatest } from '../services/currency';
import { Conversion } from '../models/Conversion';
import { HttpError } from '../errors/HttpError';
import { z } from 'zod';

const router = Router();

router.get('/currencies', requireAuth, asyncH(async (_req, res) => {
  const map = await getCurrencies();
  const list = Object.entries<any>(map).map(([code, meta]) => ({
    code, name: meta?.name ?? code
  })).sort((a, b) => a.code.localeCompare(b.code));
  res.json(list);
}));

router.get('/rates', requireAuth, asyncH(async (req, res) => {
  const base = String(req.query.base ?? 'USD');
  const symbols = req.query.symbols ? String(req.query.symbols) : undefined;
  const data = await getLatest(base, symbols);
  res.json(data); // { EUR: 0.9, PKR: 278, ... }
}));

const convertSchema = z.object({
  from: z.string().length(3),
  to: z.string().length(3),
  amount: z.number().positive()
});

router.post('/convert', requireAuth, asyncH(async (req, res) => {
  const { from, to, amount } = convertSchema.parse(req.body);
  const rates = await getLatest(from, to);
  const rate = rates[to];
  if (!rate) throw new HttpError(400, 'Rate not found');

  const result = Number((amount * rate).toFixed(6));
  const record = await Conversion.create({
    userId: req.user!.userId,
    from, to, amount, rate, result
  });
  res.json(record);
}));

export default router;
