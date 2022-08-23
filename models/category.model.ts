import { model, Schema } from 'mongoose';

const schema = new Schema({
    name: { type: String, required: true },
    color: { type: String },
    icon: { type: String },
});

schema.virtual('id').get(function () {
    return this._id.toHexString();
});

schema.set('toJSON', { virtuals: true });

export default model('Category', schema);
