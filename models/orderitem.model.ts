import { model, Schema } from 'mongoose';
import { IProduct } from './product.model';

export interface IOrderItem {
    product: IProduct
    quantity: number
}

const schema = new Schema<IOrderItem>({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: { type: Number, default: 0 },
});

schema.virtual('id').get(function () {
    return this._id.toHexString();
});

schema.set('toJSON', { virtuals: true });

export default model<IOrderItem>('OrderItem', schema);
