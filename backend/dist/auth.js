"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.authenticate = authenticate;
exports.requireAdmin = requireAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const SECRET = process.env.JWT_SECRET || 'change-this-secret';
function generateToken(user) {
    return jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '7d' });
}
function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing token' });
    }
    const token = header.substring(7);
    try {
        const payload = jsonwebtoken_1.default.verify(token, SECRET);
        const user = db_1.db.data?.users.find(u => u.id === payload.id);
        if (!user)
            return res.status(401).json({ error: 'Invalid token' });
        req.user = { id: user.id, role: user.role, email: user.email };
        next();
    }
    catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
function requireAdmin(req, res, next) {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin only' });
    }
    next();
}
