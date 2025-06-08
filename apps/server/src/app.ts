import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/user.routes';
import teamRoutes from './routes/team.routes';
import userRoleRoutes from './routes/userRole.routes';
import roleRoutes from './routes/role.routes';
import todoRoutes from './routes/todo.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/user-roles', userRoleRoutes);
app.use('/api/todos', todoRoutes);
app.use('/auth', authRoutes);

export default app;
