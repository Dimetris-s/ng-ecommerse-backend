import { Request, Response } from 'express';
import { IRequest } from '../@types';
import ProductModel, { IProduct } from '../models/product.model';
import { Category, Product } from '../models';
import mongoose from 'mongoose';

class ProductController {
    async getAll(req: Request, res: Response) {
        const { categories } = req.query;
        let filter = {};
        if (categories) {
            filter = { category: (categories as string).split(',') };
        }
        try {
            const products = await Product.find(filter).populate('category');
            if (!products) {
                return res
                    .status(404)
                    .json({ success: false, error: { message: 'Not found!' } });
            }
            res.status(200).json(products);
        } catch (e) {
            res.status(500).send('Server error!');
        }
    }

    async getOne(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;
            const product = await Product.findById(id).populate('category');
            if (!product) {
                return res
                    .status(404)
                    .json({ success: false, error: { message: 'Not found!' } });
            }
            res.status(200).json(product);
        } catch (e) {
            res.status(500).send('Server error!');
        }
    }

    async create(req: IRequest<IProduct>, res: Response) {
        try {
            const category = await Category.findById(req.body.category);
            if (!category) {
                return res.status(400).send('Invalid category');
            }
            const file = req.file;
            if (!file) {
                return res.status(400).send('No file');
            }
            const fileName = `${req.protocol}://${req.get(
                'host'
            )}/public/uploads/${req.file?.filename}`;

            const product = new ProductModel({
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                isFeatured: req.body.isFeatured,
                image: fileName,
                numReviews: req.body.numReviews,
                rating: req.body.rating,
                category: req.body.category,
                brand: req.body.brand,
                countInStock: req.body.countInStock,
                price: req.body.price,
            });
            const createdProduct = await product.save();
            if (!createdProduct) {
                return res.status(500).send('Product cannot be created!');
            }
            res.status(201).json(createdProduct);
        } catch (e) {
            res.status(500).send('Server error!');
        }
    }

    async update(req: Request<{ id: string }, {}, IProduct>, res: Response) {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: { message: 'Invalid object id' },
            });
        }
        try {
            const category = await Category.findById(req.body.category);
            if (!category) {
                return res.status(400).send('Invalid category');
            }
            const product = await Product.findById(id);
            if (!product) {
                return res.status(400).send('Invalid product');
            }
            let imagepath = req.file
                ? `${req.protocol}://${req.get('host')}/public/uploads/${
                      req.file?.filename
                  }`
                : product.image;
            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                {
                    name: req.body.name,
                    description: req.body.description,
                    richDescription: req.body.richDescription,
                    isFeatured: req.body.isFeatured,
                    image: imagepath,
                    numReviews: req.body.numReviews,
                    rating: req.body.rating,
                    category: req.body.category,
                    brand: req.body.brand,
                    countInStock: req.body.countInStock,
                    price: req.body.price,
                },
                {
                    new: true,
                }
            );

            if (!updatedProduct) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'Can not update product!' },
                });
            }
            res.status(200).json(updatedProduct);
        } catch (e) {
            res.status(500).send('Server error!');
        }
    }

    async remove(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        try {
            const product = await Product.findByIdAndRemove(id);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: { message: 'Not found!' },
                });
            }
            res.status(200).json(product);
        } catch (e) {
            res.status(500).json({ success: false, error: e });
        }
    }

    async getCount(req: Request, res: Response) {
        const count = await Product.countDocuments();
        if (!count) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, productCount: count });
    }

    async getFeatured(req: Request, res: Response) {
        const limit = req.query?.limit || 0;
        const featuredProducts = await Product.find({
            isFeatured: true,
        }).limit(+limit);
        if (!featuredProducts) {
            return res
                .status(400)
                .json({ success: false, error: { message: 'Not found!' } });
        }
        res.status(200).json(featuredProducts);
    }

    async updateGallery(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        try {
            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'Invalid object id' },
                });
            }
            const files = req.files;
            if (!files) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'No files' },
                });
            }
            const baseUrl = `${req.protocol}://${req.get(
                'host'
            )}/public/uploads/`;
            const imagesPaths = (files as Express.Multer.File[]).map(
                (file) => `${baseUrl}${file.filename}`
            );

            const product = await Product.findByIdAndUpdate(
                id,
                {
                    images: imagesPaths,
                },
                { new: true }
            );
            if (!product) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'Can not update product!' },
                });
            }
            res.status(200).json(product);
        } catch (e) {
            res.status(500).send('Server error!');
        }
    }
}

export default new ProductController();
