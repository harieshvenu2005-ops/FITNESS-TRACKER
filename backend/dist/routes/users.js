"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
// list all users (admin only)
router.get('/', async (req, res) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin only' });
    }
    res.json(db_1.db.data?.users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })) || []);
});
// get profile of current user
router.get('/profile', (req, res) => {
    const userId = req.user?.id;
    const user = db_1.db.data?.users.find(u => u.id === userId);
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});
// admin can create a new user (including admin)
router.post('/', async (req, res) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin only' });
    }
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'name email and password required' });
    }
    const existing = db_1.db.data?.users.find(u => u.email === email);
    if (existing)
        return res.status(409).json({ error: 'Email already in use' });
    const user = { id: (0, uuid_1.v4)(), name, email, password, role: role === 'admin' ? 'admin' : 'user' };
    db_1.db.data?.users.push(user);
    await db_1.db.write();
    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
});
exports.default = router;
