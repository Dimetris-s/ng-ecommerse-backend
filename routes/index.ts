import { Router } from 'express';
import productRouter from './product.router';
import orderRouter from './order.router';
import userRouter from './user.router';
import categoryRouter from './category.router';
import orderItemsRouter from './orderitems.router';
import authRouter from './auth.router';

const router = Router({ mergeParams: true });

router.use('/product', productRouter);
router.use('/order', orderRouter);
router.use('/user', userRouter);
router.use('/category', categoryRouter);
router.use('/orderitems', orderItemsRouter);
router.use('/auth', authRouter);

export { router };
