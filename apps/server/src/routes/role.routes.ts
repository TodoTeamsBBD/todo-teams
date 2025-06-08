import { Router } from 'express';
import * as roleController from '../controllers/role.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', requireAuth, roleController.getAll);

export default router;
