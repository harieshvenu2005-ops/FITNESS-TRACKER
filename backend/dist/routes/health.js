"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
// Get health entries; admin may request any user, normal user only their own
router.get('/', async (req, res) => {
    const requesterId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';
    let userId = String(req.query.userId || '');
    if (!isAdmin) {
        userId = requesterId || '';
    }
    const entries = db_1.db.data?.healthEntries.filter((e) => e.userId === userId) || [];
    res.json(entries);
});
// Create a new entry; userId is taken from token unless admin specifies
router.post('/', async (req, res) => {
    let { userId, type, value, date, time } = req.body;
    const requesterId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';
    if (!isAdmin) {
        userId = requesterId || '';
    }
    const entry = { id: (0, uuid_1.v4)(), userId, type, value, date, time };
    db_1.db.data?.healthEntries.push(entry);
    await db_1.db.write();
    res.status(201).json(entry);
});
exports.default = router;
