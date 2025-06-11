import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', requireAuth, userController.getAllPaginated);
router.get('/teams/available-members', requireAuth, userController.getAllPaginated);

export default router;