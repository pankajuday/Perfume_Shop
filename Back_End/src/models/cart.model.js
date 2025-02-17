import mongoose, { Schema } from 'mongoose';
import { Product } from './product.model';

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        shippingCost: {
          type: Number,
          default:0,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timeStamps: true }
);

// Middleware

cartSchema.methods.calculateTotalPrice = async () => {
  const cart = this;
  let total = 0;
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (product) {
      total += (product.price * item.quantity) + item.shippingCost;
    }
  }
  Cart.totalPrice = total;
};

export const Cart = mongoose.model('Cart', cartSchema);
