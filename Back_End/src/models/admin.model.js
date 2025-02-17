import mongoose, { Schema } from 'mongoose';

const adminSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    catalog: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    newOrder: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    oldOrder: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    returnedOrder: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    cancelledOrder: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    totalProduct: {
      type: Number,
    },
  },
  { timestamps: true }
);

adminSchema.pre('save', function () {
  this.totalProduct = this.catalog.length;
  next();
});

adminSchema.methods.newOrder = function(){
  
}

export const Admin = mongoose.model('Admin', adminSchema);
