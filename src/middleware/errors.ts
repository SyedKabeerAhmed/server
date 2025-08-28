import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/HttpError';

export function notFound(req: Request, res: Response) {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const isHttp = err instanceof HttpError;
  const status = isHttp ? err.status : 500;
  const body: any = { error: isHttp ? err.message : 'Internal error' };

  if (isHttp && err.details) body.details = err.details;
  if (process.env.NODE_ENV === 'development' && !isHttp) body.stack = String(err?.stack ?? err);

  res.status(status).json(body);
}
