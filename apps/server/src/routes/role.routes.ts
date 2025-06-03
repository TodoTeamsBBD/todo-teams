import { Router } from 'express';
import * as roleController from '../controllers/role.controller';

const router = Router();

router.get('/', roleController.getAll);
router.get('/:id', roleController.getOne);
router.post('/', roleController.create);
router.put('/:id', roleController.update);
router.delete('/:id', roleController.remove);

export default router;
