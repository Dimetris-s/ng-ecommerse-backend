import { Router } from 'express';
import userController from '../controllers/user.controller';

const router = Router({ mergeParams: true });

router.get('/', userController.getAll);
router.get('/:id', userController.getOne);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.get('/get/count', userController.getCount);
router.delete('/:id', userController.remove);

export default router;
