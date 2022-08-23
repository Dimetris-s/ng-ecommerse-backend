import { Router } from 'express';
import { categoryController } from '../controllers';

const router = Router({ mergeParams: true });

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getOne);
router.post('/', categoryController.create);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.remove);

export default router;
