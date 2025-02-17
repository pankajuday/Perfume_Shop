import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    variant: {
      type: String, // e.g., "Size: M, Color: Red"
      default: null,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10, // Notify when stock falls below this number
    },
    incomingStock: {
      type: Number,
      default: 0, // Stock expected from suppliers
    },
    reservedStock: {
      type: Number,
      default: 0, // Stock reserved for orders not yet completed
    },
    soldStock: {
      type: Number,
      default: 0, // Total stock sold
    },
    restockedAt: {
      type: Date, // Date of the last stock addition
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin', // Reference to the admin making the update
      required: true,
    },
  },
  { timestamps: true }
);

export const Inventory= mongoose.model('Inventory', inventorySchema);
