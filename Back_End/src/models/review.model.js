import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const reviewShema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        
      },
    ],
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

reviewShema.plugin(mongooseAggregatePaginate)

export const Review = mongoose.model('Review', reviewShema);
