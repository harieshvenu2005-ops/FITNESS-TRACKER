"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const health_1 = __importDefault(require("./routes/health"));
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./routes/auth"));
const medications_1 = __importDefault(require("./routes/medications"));
const messages_1 = __importDefault(require("./routes/messages"));
const recipes_1 = __importDefault(require("./routes/recipes"));
const auth_2 = require("./auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// health-compliance endpoints
app.use('/api/auth', auth_1.default);
// protect health and user routes
app.use('/api/health', auth_2.authenticate, health_1.default);
app.use('/api/users', auth_2.authenticate, users_1.default);
app.use('/api/medications', auth_2.authenticate, medications_1.default);
app.use('/api/messages', auth_2.authenticate, messages_1.default);
app.use('/api/recipes', recipes_1.default);
app.get('/api/hello', (_req, res) => {
    res.json({ message: 'Hello from backend' });
});
(0, db_1.init)().then(() => {
    app.listen(PORT, () => {
        console.log(`Backend running at http://localhost:${PORT}`);
    });
});
