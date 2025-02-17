import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },

    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled", "Returned"],
      default: "Processing",
    },
  },
  { timeseries: true }
);

export const Order = mongoose.model("Order", orderSchema);
