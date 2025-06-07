import { Router } from 'express';
import * as todoController from '../controllers/todo.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/:id', requireAuth, todoController.getToDo);
router.post('/', requireAuth, todoController.create);
router.put('/:id', requireAuth, todoController.update);
router.delete('/:id', requireAuth, todoController.remove);

export default router;
