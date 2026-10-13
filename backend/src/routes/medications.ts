import { Router, Request, Response } from 'express';
import { db } from '../db';
import { authenticate, requireAdmin, AuthRequest } from '../auth';

const router = Router();

// Get medications for user (or admin for any user)
router.get('/', authenticate, (req: AuthRequest, res: Response) => {
  const userId = req.query.userId as string || req.user!.id;
  if (userId !== req.user!.id && req.user!.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  const medications = db.data!.medications.filter((m: any) => m.userId === userId);
  res.json(medications);
});

// Add medication
router.post('/', authenticate, (req: AuthRequest, res: Response) => {
  const { name, dosage, frequency, startDate, endDate, notes } = req.body;
  const medication = {
    id: Date.now().toString(),
    userId: req.user!.id,
    name,
    dosage,
    frequency,
    startDate,
    endDate,
    notes
  };
  db.data!.medications.push(medication);
  db.write();
  res.status(201).json(medication);
});

// Update medication
router.put('/:id', authenticate, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const medication = db.data!.medications.find((m: any) => m.id === id && m.userId === req.user!.id);
  if (!medication) return res.status(404).json({ error: 'Medication not found' });
  Object.assign(medication, req.body);
  db.write();
  res.json(medication);
});

// Delete medication
router.delete('/:id', authenticate, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const index = db.data!.medications.findIndex((m: any) => m.id === id && m.userId === req.user!.id);
  if (index === -1) return res.status(404).json({ error: 'Medication not found' });
  db.data!.medications.splice(index, 1);
  db.write();
  res.status(204).send();
});

export default router;