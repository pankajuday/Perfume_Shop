import mongoose, { Schema } from 'mongoose';

const likeSchema = new Schema(
  {
    review: {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
    product: { // wishlist 
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model('Like', likeSchema);
