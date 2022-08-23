import { Router } from 'express';
import { orderController } from '../controllers';

const router = Router({ mergeParams: true });

router.get('/', orderController.getAll);
router.get('/:id', orderController.getOne);
router.get('/get/userorders/:userId', orderController.getUserOrders);
router.get('/get/totalsales', orderController.getTotalSales);
router.get('/get/count', orderController.getCount);
router.post('/', orderController.create);
router.put('/:id', orderController.updateStatus);
router.delete('/:id', orderController.remove);

export default router;
