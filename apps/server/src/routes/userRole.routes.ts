import { Router } from 'express';
import * as userRoleController from '../controllers/userRole.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/team/:teamId', requireAuth, userRoleController.getTeamMembers);
router.post('/', requireAuth, userRoleController.create);
router.put('/:userRoleId', requireAuth, userRoleController.update);
router.delete('/:userRoleId', requireAuth, userRoleController.remove);
router.get('/team/:teamId/users', requireAuth, userRoleController.getUsersByTeam);


export default router;
