import { Request, Response } from 'express';

const { Category } = require('../models');

class CategoryController {
    public async getAll(req: Request, res: Response) {
        try {
            const categories = await Category.find();
            res.status(200).json(categories);
        } catch (e) {
            res.status(500).json({ success: false, error: e });
        }
    }

    public async getOne(req: Request<{ id: string }>, res: Response) {
        try {
            const category = await Category.findById(req.params.id);
            if (!category) {
                return res
                    .status(404)
                    .json({ success: false, error: { message: 'Not found!' } });
            }
            res.status(200).json(category);
        } catch (e) {
            res.status(500).json({ success: false, error: e });
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const { name, color, icon } = req.body;
            const category = new Category({ name, color, icon });
            const createdCategory = await category.save();
            if (!createdCategory) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'Can not create category' },
                });
            }
            res.status(201).json(createdCategory);
        } catch (e) {
            res.status(500).json({ success: false, error: e });
        }
    }

    public async update(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;
            const foundCategory = await Category.findByIdAndUpdate(
                id,
                req.body,
                { new: true }
            );
            if (!foundCategory) {
                return res.status(404).json({
                    success: false,
                    error: { message: 'Not found!' },
                });
            }
            res.status(200).json(foundCategory);
        } catch (e) {
            res.status(500).json({ success: false, error: e });
        }
    }

    public async remove(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        try {
            const category = await Category.findByIdAndRemove(id);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    error: { message: 'Not found!' },
                });
            }
            res.status(200).json(category);
        } catch (e) {
            res.status(500).json({ success: false, error: e });
        }
    }
}

export default new CategoryController();
