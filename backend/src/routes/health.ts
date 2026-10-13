import { Router } from 'express';
import { db } from '../db';
import { v4 as uuid } from 'uuid';
import { AuthRequest, requireAdmin } from '../auth';

const router = Router();

// Get health entries; admin may request any user, normal user only their own
router.get('/', async (req: AuthRequest, res) => {
  const requesterId = req.user?.id;
  const isAdmin = req.user?.role === 'admin';
  let userId = String(req.query.userId || '');
  if (!isAdmin) {
    userId = requesterId || '';
  }
  const entries = db.data?.healthEntries.filter((e) => e.userId === userId) || [];
  res.json(entries);
});

// Create a new entry; userId is taken from token unless admin specifies
router.post('/', async (req: AuthRequest, res) => {
  let { userId, type, value, date, time } = req.body;
  const requesterId = req.user?.id;
  const isAdmin = req.user?.role === 'admin';
  if (!isAdmin) {
    userId = requesterId || '';
  }
  const entry = { id: uuid(), userId, type, value, date, time };
  db.data?.healthEntries.push(entry);
  await db.write();
  res.status(201).json(entry);
});

export default router;
