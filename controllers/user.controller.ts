import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import {  User } from '../models';

class UserController {
    public async getAll(req: Request, res: Response) {
        try {
            const users = await User.find().select('-passwordHash');
            res.status(200).json(users);
        } catch (e) {
            res.status(500).json({ success: false, error: e });
        }
    }

    public async getOne(req: Request<{ id: string }>, res: Response) {
        try {
            const user = await User.findById(req.params.id).select(
                '-passwordHash'
            );
            if (!user) {
                return res
                    .status(404)
                    .json({ success: false, error: { message: 'Not found!' } });
            }
            res.status(200).json(user);
        } catch (e) {
            res.status(500).json({ success: false, error: e });
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const user = new User({
                passwordHash: bcrypt.hashSync(req.body.password, 10),
                name: req.body.name,
                email: req.body.email,
                street: req.body.street,
                apartment: req.body.apartment,
                city: req.body.city,
                zip: req.body.zip,
                country: req.body.country,
                phone: req.body.phone,
                isAdmin: req.body.isAdmin,
            });
            const createdUser = await user.save();
            if (!createdUser) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'Can not create user' },
                });
            }
            res.status(201).json(createdUser);
        } catch (e) {
            res.status(500).json({ success: false, error: e });
        }
    }

    public async update(req: Request<{ id: string }>, res: Response) {
        try {
            let newPassword;
            const { id } = req.params;
            const userExist = await User.findById(id);
            if (!userExist) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        error: { message: 'User not found!' },
                    });
            }
            if (req.body.password) {
                newPassword = bcrypt.hashSync(req.body.password);
            } else {
                newPassword = userExist.passwordHash;
            }
            const user = await User.findByIdAndUpdate(
                id,
                {
                    passwordHash: newPassword,
                    name: req.body.name,
                    email: req.body.email,
                    street: req.body.street,
                    apartment: req.body.apartment,
                    city: req.body.city,
                    zip: req.body.zip,
                    country: req.body.country,
                    phone: req.body.phone,
                    isAdmin: req.body.isAdmin,
                },
                {
                    new: true,
                }
            );
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: { message: 'Not found!' },
                });
            }
            res.status(200).json(user);
        } catch (e) {
            res.status(500).json({ success: false, error: e });
        }
    }
    public async getCount(req: Request, res: Response) {
        const count = await User.countDocuments();
        if (!count) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, userCount: count });
    }
    public async remove(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        try {
            const user = await User.findByIdAndRemove(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: { message: 'Not found!' },
                });
            }
            res.status(200).json(user);
        } catch (e) {
            res.status(500).json({ success: false, error: e });
        }
    }
}

export default new UserController();
