import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { init } from './db';
import healthRouter from './routes/health';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import medicationsRouter from './routes/medications';
import messagesRouter from './routes/messages';
import recipesRouter from './routes/recipes';
import { authenticate } from './auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// health-compliance endpoints
app.use('/api/auth', authRouter);

// protect health and user routes
app.use('/api/health', authenticate, healthRouter);
app.use('/api/users', authenticate, usersRouter);
app.use('/api/medications', authenticate, medicationsRouter);
app.use('/api/messages', authenticate, messagesRouter);
app.use('/api/recipes', recipesRouter);

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from backend' });
});

init().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
  });
});
