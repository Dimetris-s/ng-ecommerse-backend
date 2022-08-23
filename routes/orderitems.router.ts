import { Router } from 'express';

const router = Router({ mergeParams: true });

router.get('/', (req, res) => {
    res.send('items');
});

export default router;
