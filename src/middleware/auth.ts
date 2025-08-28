import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';
import { HttpError } from '../errors/HttpError';

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) throw new HttpError(401, 'Missing token');
  const payload = verifyJwt(h.split(' ')[1]);
  if (!payload) throw new HttpError(401, 'Invalid token');
  req.user = payload;
  next();
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'ADMIN') throw new HttpError(403, 'Admin only');
  next();
}
