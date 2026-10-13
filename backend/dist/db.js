"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.init = init;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const file = path_1.default.join(__dirname, '..', process.env.DB_FILE || 'data/db.json');
const defaultData = {
    users: [],
    healthEntries: [],
    medications: [],
    messages: [],
    recipes: []
};
function readData() {
    try {
        if (!fs_1.default.existsSync(file))
            return { ...defaultData };
        const raw = fs_1.default.readFileSync(file, 'utf-8');
        return JSON.parse(raw);
    }
    catch {
        return { ...defaultData };
    }
}
function writeData(data) {
    const dir = path_1.default.dirname(file);
    if (!fs_1.default.existsSync(dir))
        fs_1.default.mkdirSync(dir, { recursive: true });
    fs_1.default.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}
const data = readData();
exports.db = {
    data,
    read() {
        const fresh = readData();
        Object.assign(this.data, fresh);
    },
    write() {
        writeData(this.data);
    }
};
async function init() {
    exports.db.read();
    if (exports.db.data.users.length === 0) {
        exports.db.data.users.push({
            id: '1',
            name: 'Administrator',
            email: 'admin@example.com',
            password: 'admin',
            role: 'admin'
        });
        exports.db.write();
    }
}
