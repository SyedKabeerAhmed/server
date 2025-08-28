import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User } from '../models/User';
import { signJwt } from '../utils/jwt';
import { HttpError } from '../errors/HttpError';
import { asyncH } from '../utils/async';

const router = Router();

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post('/register', asyncH(async (req, res) => {
  const { email, password } = credsSchema.parse(req.body);
  const exists = await User.findOne({ email });
  if (exists) throw new HttpError(400, 'Email already used');

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash: hash, role: 'USER' });
  res.json({ id: user._id.toString(), email: user.email });
}));

router.post('/login', asyncH(async (req, res) => {
  const { email, password } = credsSchema.parse(req.body);
  const user = await User.findOne({ email });
  if (!user) throw new HttpError(400, 'Invalid credentials');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new HttpError(400, 'Invalid credentials');

  const token = signJwt({ userId: user._id.toString(), role: user.role as 'USER'|'ADMIN' });
  res.json({ token });
}));

export default router;
