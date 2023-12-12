import mongoose, { Schema } from 'mongoose';

const cartSchema = new Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    size: {
        type: Schema.Types.Mixed
    },
    color: {
        type: Schema.Types.Mixed
    }

});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;