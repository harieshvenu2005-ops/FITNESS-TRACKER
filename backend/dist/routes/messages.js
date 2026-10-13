"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../auth");
const router = (0, express_1.Router)();
// Get messages for user
router.get('/', auth_1.authenticate, (req, res) => {
    const messages = db_1.db.data.messages.filter(m => m.fromUserId === req.user.id || m.toUserId === req.user.id);
    res.json(messages);
});
// Send message
router.post('/', auth_1.authenticate, (req, res) => {
    const { toUserId, content, type = 'text' } = req.body;
    const message = {
        id: Date.now().toString(),
        fromUserId: req.user.id,
        toUserId,
        content,
        timestamp: new Date().toISOString(),
        type
    };
    db_1.db.data.messages.push(message);
    db_1.db.write();
    res.status(201).json(message);
});
// Admin can view all messages
router.get('/admin', auth_1.authenticate, auth_1.requireAdmin, (req, res) => {
    res.json(db_1.db.data.messages);
});
exports.default = router;
