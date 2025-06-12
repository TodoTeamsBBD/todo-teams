import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import userRoutes from './routes/user.routes';
import teamRoutes from './routes/team.routes';
import userRoleRoutes from './routes/userRole.routes';
import roleRoutes from './routes/role.routes';
import todoRoutes from './routes/todo.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();
const app = express();

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: {
    status: 429,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

app.use(apiLimiter);


app.use(cors({
  origin: process.env['CORS_ORIGIN'] || 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/user-roles', userRoleRoutes);
app.use('/api/todos', todoRoutes);
app.use('/auth', authRoutes);

export default app;
