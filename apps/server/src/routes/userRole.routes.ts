import { Router } from 'express';
import * as userRoleController from '../controllers/userRole.controller';

const router = Router();

router.get('/', userRoleController.getAll);
router.get('/:id', userRoleController.getOne);
router.post('/', userRoleController.create);
router.put('/:id', userRoleController.update);
router.delete('/:id', userRoleController.remove);

export default router;
