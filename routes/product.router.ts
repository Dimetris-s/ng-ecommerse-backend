import { Router } from 'express';
import productController from '../controllers/product.controller';
import multer from 'multer';

const FILE_TYPES_MAP: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg ',
};

const storage = multer.diskStorage({
    destination(
        req: Express.Request,
        file: Express.Multer.File,
        callback: (error: Error | null, filename: string) => void
    ) {
        const isValid = FILE_TYPES_MAP[file.mimetype];
        let uploadError: Error | null = new Error('Invalid image type!');
        if (isValid) {
            uploadError = null;
        }
        callback(uploadError, 'public/uploads');
    },
    filename(
        req: Express.Request,
        file: Express.Multer.File,
        callback: (error: Error | null, filename: string) => void
    ) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPES_MAP[file.mimetype];
        callback(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

const upload = multer({ storage });

const router = Router({ mergeParams: true });

router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.get('/get/count', productController.getCount);
router.get('/get/featured', productController.getFeatured);
router.post('/', upload.single('image'), productController.create);
router.put('/:id', upload.single('image'), productController.update);
router.put(
    '/gallery-images/:id',
    upload.array('images', 10),
    productController.updateGallery
);
router.delete('/:id', productController.remove);

export default router;
