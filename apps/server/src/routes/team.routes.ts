import { Router } from 'express';
import * as controller from '../controllers/team.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', requireAuth, controller.getAllPaginated);
router.get('/user', requireAuth, controller.getTeamsForUser);
router.post('/', requireAuth, controller.create);

export default router;
