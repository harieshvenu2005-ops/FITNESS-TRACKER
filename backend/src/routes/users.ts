import { Router } from 'express';
import { db } from '../db';
import { v4 as uuid } from 'uuid';
import { AuthRequest, requireAdmin } from '../auth';

const router = Router();

// list all users (admin only)
router.get('/', async (req: AuthRequest, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }
  res.json(db.data?.users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })) || []);
});

// get profile of current user
router.get('/profile', (req: AuthRequest, res) => {
  const userId = req.user?.id;
  const user = db.data?.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

// admin can create a new user (including admin)
router.post('/', async (req: AuthRequest, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name email and password required' });
  }
  const existing = db.data?.users.find(u => u.email === email);
  if (existing) return res.status(409).json({ error: 'Email already in use' });
  const user = { id: uuid(), name, email, password, role: role === 'admin' ? 'admin' : 'user' };
  db.data?.users.push(user as any);
  await db.write();
  res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

export default router;
