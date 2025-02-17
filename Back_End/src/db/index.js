import mongoose from 'mongoose';
import { PERFUME_SHOP_DB } from '../constant.js';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${PERFUME_SHOP_DB}`
    );
    console.log(`MongoDB connected !!! Host : ,${connectionInstance.connection.host}`);
  } catch (error) {
    console.log('MongoDB connection FAILED', error);
    process.exit(1);
  }
};

export default connectDB;
