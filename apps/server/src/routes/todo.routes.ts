import { Router } from 'express';
import * as todoController from '../controllers/todo.controller';

const router = Router();

router.get('/', todoController.getAll);
router.get('/:id', todoController.getOne);
router.post('/', todoController.create);
router.put('/:id', todoController.update);
router.delete('/:id', todoController.remove);

export default router;
