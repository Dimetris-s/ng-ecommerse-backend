import { model, Schema } from 'mongoose';
import { IOrderItem } from './orderitem.model';

export interface IOrder {
    shippingAddress1: string
    shippingAddress2?: string
    city: string
    zip: string
    country: string
    phone: number
    status: string
    totalPrice: number
    user: Schema.Types.ObjectId
    dateOrdered: Date
    orderItems: IOrderItem[]
}

const schema = new Schema<IOrder>({
    shippingAddress1: { type: String, required: true },
    shippingAddress2: String,
    city: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: Number, required: true },
    status: { type: String, required: true, default: 'Pending' },
    totalPrice: Number,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    dateOrdered: { type: Date, default: Date.now },
    orderItems: [{ type: Schema.Types.ObjectId, ref: 'OrderItem' }],
});

schema.virtual('id').get(function() {
    return this._id.toHexString();
});

schema.set('toJSON', { virtuals: true });

export default model<IOrder>('Order', schema);
