import { model, Schema } from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    passwordHash: string;
    street: string;
    apartment: string;
    city: string;
    zip: string;
    country: string;
    phone: number;
    isAdmin: boolean;
}

const schema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    street: { type: String, default: '' },
    apartment: { type: String, default: '' },
    city: { type: String, default: '' },
    zip: { type: String, default: '' },
    country: { type: String, default: '' },
    phone: { type: Number, required: true },
    isAdmin: { type: Boolean, default: false },
});

schema.virtual('id').get(function () {
    return this._id.toHexString();
});

schema.set('toJSON', { virtuals: true });

export default model<IUser>('User', schema);
