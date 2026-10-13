import { Router } from 'express';
import { db } from '../db';
import { generateToken } from '../auth';
import { v4 as uuid } from 'uuid';

const router = Router();

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password required' });
  }
  const existing = db.data?.users.find(u => u.email === email);
  if (existing) {
    return res.status(409).json({ error: 'Email already in use' });
  }
  const user = {
    id: uuid(),
    name,
    email,
    password,
    role: (role === 'admin' ? 'admin' : 'user') as 'admin' | 'user'
  };
  db.data?.users.push(user);
  await db.write();
  const token = generateToken(user);
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const user = db.data?.users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  if (password !== user.password) return res.status(401).json({ error: 'Invalid credentials' });
  const token = generateToken(user);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

export default router;