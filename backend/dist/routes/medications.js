"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../auth");
const router = (0, express_1.Router)();
// Get medications for user (or admin for any user)
router.get('/', auth_1.authenticate, (req, res) => {
    const userId = req.query.userId || req.user.id;
    if (userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    const medications = db_1.db.data.medications.filter((m) => m.userId === userId);
    res.json(medications);
});
// Add medication
router.post('/', auth_1.authenticate, (req, res) => {
    const { name, dosage, frequency, startDate, endDate, notes } = req.body;
    const medication = {
        id: Date.now().toString(),
        userId: req.user.id,
        name,
        dosage,
        frequency,
        startDate,
        endDate,
        notes
    };
    db_1.db.data.medications.push(medication);
    db_1.db.write();
    res.status(201).json(medication);
});
// Update medication
router.put('/:id', auth_1.authenticate, (req, res) => {
    const { id } = req.params;
    const medication = db_1.db.data.medications.find((m) => m.id === id && m.userId === req.user.id);
    if (!medication)
        return res.status(404).json({ error: 'Medication not found' });
    Object.assign(medication, req.body);
    db_1.db.write();
    res.json(medication);
});
// Delete medication
router.delete('/:id', auth_1.authenticate, (req, res) => {
    const { id } = req.params;
    const index = db_1.db.data.medications.findIndex((m) => m.id === id && m.userId === req.user.id);
    if (index === -1)
        return res.status(404).json({ error: 'Medication not found' });
    db_1.db.data.medications.splice(index, 1);
    db_1.db.write();
    res.status(204).send();
});
exports.default = router;
