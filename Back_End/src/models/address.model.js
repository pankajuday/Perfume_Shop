import mongoose, { Schema } from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pinCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const Address = mongoose.model('Address', addressSchema);
