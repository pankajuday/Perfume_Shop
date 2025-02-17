import argon2 from 'argon2';
import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
      index: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, 'password is required'],
    },
    addresses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Address',
      },
    ],
    orderAddress:{
      type: Schema.Types.ObjectId,
      ref: 'Address',
    },
    orderHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await argon2.hash(this.password);
  next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
  return await argon2.verify(this.password, password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model('User', userSchema);
