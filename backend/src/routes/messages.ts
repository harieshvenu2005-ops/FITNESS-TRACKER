import { Router } from 'express';
import { db } from '../db';
import { authenticate, requireAdmin } from '../auth';

const router = Router();

// Get messages for user
router.get('/', authenticate, (req, res) => {
  const messages = db.data.messages.filter(m => m.fromUserId === req.user!.id || m.toUserId === req.user!.id);
  res.json(messages);
});

// Send message
router.post('/', authenticate, (req, res) => {
  const { toUserId, content, type = 'text' } = req.body;
  const message = {
    id: Date.now().toString(),
    fromUserId: req.user!.id,
    toUserId,
    content,
    timestamp: new Date().toISOString(),
    type
  };
  db.data.messages.push(message);
  db.write();
  res.status(201).json(message);
});

// Admin can view all messages
router.get('/admin', authenticate, requireAdmin, (req, res) => {
  res.json(db.data.messages);
});

export default router;