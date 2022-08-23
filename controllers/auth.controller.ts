import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models';
import { IRequest } from '../@types';

class AuthController {
    async login(req: IRequest<{ password: string, email: string }>, res: Response) {
        const {
            password, email,
        } = req.body;
        try {
            const existUser = await User.findOne({ email });
            if(!existUser) {
                return res.status(404).json({ success: false, error: { message: 'User not found!' } });
            }
            const passwordCorrect = bcrypt.compareSync(password, existUser.passwordHash);
            if(!passwordCorrect) {
                return res.status(400).json({ success: false, error: { message: 'Incorrect email or password!' } });
            }
            const token = jwt.sign({
                userId: existUser.id,
                isAdmin: existUser.isAdmin
            }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
            res.status(200).json({ user: existUser.email, token });
        } catch(e) {
            res.status(500).send('Unexpected Error!');
        }

    }

    async register(req: Request, res: Response) {
    }
}

export default new AuthController();