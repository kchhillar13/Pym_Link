import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';
import redirectRoutes from './routes/redirect.js';
import publicRoutes from './routes/public.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Redirect Routes (High priority, catches /:username/:project_slug/:label)
app.use('/', redirectRoutes);

// Auth Routes
app.use('/api/auth', authRoutes);

// Public API Routes
app.use('/api/public', publicRoutes);

// API Routes
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Pym-Link Backend started at port: ${PORT}`);
});
