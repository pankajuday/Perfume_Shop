import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags:[],
    brand: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    }, // Ensure price cannot be negative
    category: {
      type: String,
      required: true,
      enum: ['Men', 'Women', 'Unisex'], // Static list of categories
    },
    fragranceType: {
      type: String,
      enum: ['Citrus', 'Floral', 'Woody', 'Oriental', 'Fresh'], // Static fragrance types
    },
    reviews: {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
    
    images: [
      {
        type:String,
        required:true
      },
    ],
    logo:{
      type:String,
      required:true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  { timestamps: true }
);

productSchema.plugin(mongooseAggregatePaginate)

export const Product = mongoose.model('Product', productSchema);
