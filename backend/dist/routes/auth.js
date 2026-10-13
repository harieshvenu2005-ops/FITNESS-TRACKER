"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../auth");
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'name, email and password required' });
    }
    const existing = db_1.db.data?.users.find(u => u.email === email);
    if (existing) {
        return res.status(409).json({ error: 'Email already in use' });
    }
    const user = {
        id: (0, uuid_1.v4)(),
        name,
        email,
        password,
        role: (role === 'admin' ? 'admin' : 'user')
    };
    db_1.db.data?.users.push(user);
    await db_1.db.write();
    const token = (0, auth_1.generateToken)(user);
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: 'email and password required' });
    const user = db_1.db.data?.users.find(u => u.email === email);
    if (!user)
        return res.status(401).json({ error: 'Invalid credentials' });
    if (password !== user.password)
        return res.status(401).json({ error: 'Invalid credentials' });
    const token = (0, auth_1.generateToken)(user);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});
exports.default = router;
