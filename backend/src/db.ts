import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

export interface HealthEntry {
  id: string;
  userId: string;
  type: string;
  value: number;
  date: string;
  time?: string;
}

export interface Medication {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'video_call' | 'file';
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  tags: string[];
}

export interface Data {
  users: User[];
  healthEntries: HealthEntry[];
  medications: Medication[];
  messages: Message[];
  recipes: Recipe[];
}

const file = path.join(__dirname, '..', process.env.DB_FILE || 'data/db.json');

const defaultData: Data = {
  users: [],
  healthEntries: [],
  medications: [],
  messages: [],
  recipes: []
};

function readData(): Data {
  try {
    if (!fs.existsSync(file)) return { ...defaultData };
    const raw = fs.readFileSync(file, 'utf-8');
    return JSON.parse(raw) as Data;
  } catch {
    return { ...defaultData };
  }
}

function writeData(data: Data): void {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

const data = readData();

export const db = {
  data,
  read() {
    const fresh = readData();
    Object.assign(this.data, fresh);
  },
  write() {
    writeData(this.data);
  }
};

export async function init() {
  db.read();
  if (db.data.users.length === 0) {
    db.data.users.push({
      id: '1',
      name: 'Administrator',
      email: 'admin@example.com',
      password: 'admin',
      role: 'admin'
    });
    db.write();
  }
}
