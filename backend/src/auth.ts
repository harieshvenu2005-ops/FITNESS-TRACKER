import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from './db';

export interface AuthRequest extends Request {
  user?: any;
}

const SECRET = process.env.JWT_SECRET || 'change-this-secret';

export function generateToken(user: { id: string; role: string }) {
  return jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '7d' });
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }
  const token = header.substring(7);
  try {
    const payload: any = jwt.verify(token, SECRET);
    const user = db.data?.users.find(u => u.id === payload.id);
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    req.user = { id: user.id, role: user.role, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }
  next();
}
