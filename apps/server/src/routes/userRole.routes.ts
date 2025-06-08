import { Router } from 'express';
import * as userRoleController from '../controllers/userRole.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', requireAuth, userRoleController.create);
router.put('/:id', requireAuth, userRoleController.update);
router.delete('/:id', requireAuth, userRoleController.remove);

export default router;
