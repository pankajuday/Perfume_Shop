import mongoose, { Schema } from 'mongoose';

const paymentSchema = new Schema({
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    
  },
  paymentMethod: {
    type: String,
    enum: ['Card', 'UPI', 'Net Banking', 'COD'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending',
  },
  transactionId: {
    type: String,
  },
});

export const Payment = mongoose.model('Payment', paymentSchema);
