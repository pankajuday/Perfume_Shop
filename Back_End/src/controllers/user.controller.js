import { User } from "../models/user.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";


const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(500, "something went wrong while generating token");
  }
};

const registration = asyncHandler(async (req, res) => {
  const { fullName, email, password, username } = req.body;


  const avatarLocalPath = req.files?.avatar[0]?.path;

  if ([fullName, email, password, username].some((field) => field?.trim() == ""))
    throw new ApiError(401, "All fields are required");

  if (!avatarLocalPath) throw new ApiError(404, "Avatar file is required");

  const isUserExist = await User.findOne({
    $and: [{ username }, { email }],
  });

  if (isUserExist) throw new ApiError(409, "User already exist");
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) throw new ApiError(404, "Avatar file is required. PLEASE TRY AGAIN");

  const user = await User.create({
    fullName,
    password,
    username: username.toLowerCase(),
    avatar: avatar.url,
    email:email.toLowerCase(),
  });

  const userCreated = await User.findById(user._id).select("-password -refreshToken");
  if (!userCreated) throw new ApiError(500, "Something went wrong while registering the user");

  return res.status(200).json(new ApiResponse(200, userCreated, "User Registered successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

try {
    const user = await User.findOne({ username });
  
    if (!user) throw new ApiError(404, "User does not exist. PLEASE REGISTER");
    //WARN: 
    const isPasswordValid = await user.isPasswordCorrect(password);
  
    if (!isPasswordValid) throw new ApiError(400, "Invalid user credentials");
   
    
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user?._id);
  
    const loggedUser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
      httpOnly: true,
      secure: true,
    };
  
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, { user: loggedUser }, "User successfully logged in"));
} catch (error) {
  return res.status(error.statusCode).json(new ApiError(error.statusCode,{},`${error.message}`));
}
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unse: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logout successfully"));
});

const refreshRefreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorize request");

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);

    if (!user) throw new ApiError(401, "Invalid refresh token");

    if (incomingRefreshToken !== user?.refreshToken)
      throw new ApiError(401, "Refresh token expire or used");

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user?._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, { accessToken, refreshToken }, "Successfully refresh token refreshed")
      );
  } catch (error) {
    return res.status(error.statusCode).json(new ApiError(error.statusCode,{},`${error.message}`));
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { password, newPassword, confirmPassword } = req.body;

  if ([password, newPassword, confirmPassword].some((fields) => fields?.trim() === ""))
    throw new ApiError(404, "all Fields are required");

  if (newPassword !== confirmPassword) throw new ApiError(400, "Please Enter same password");

  const user = await User.findById(req.user?._id);

  if (!user) throw new ApiError(401, "Unauthorize access");

  const isPasswordValid = user.isPasswordCorrect(toString(password));

  if (!isPasswordValid) throw new ApiError(400, "Invalid old password");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, " password changed Successfully"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  const oldAvatar = req.user?.avatar;

  const newAvatar = req.files?.avatar;

  if (!newAvatar) throw new ApiError(404, "Avatar file not found");

  const options = {
    resource_type: "image",
  };

  await deleteFromCloudinary(oldAvatar, options);
  const updatedAvatar = await uploadOnCloudinary(newAvatar);

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: updatedAvatar.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  if (!user) throw new ApiError(400, "something went wrong");

  return res.status(200).json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email, username } = req.body;
  if ([fullName, email, username].some((fields) => files?.trim() === ""))
    throw new ApiError(401, "All fields are required");
  const updatedDetails = await User.findByIdAndUpdate(
    req.user?._id,
    {
      fullName: fullName,
      email: email,
    },
    {
      new: true,
    }
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, updatedDetails, "User Account details updated"));
});

const getUserOrderHistory = asyncHandler(async (req, res) => {
  // TODO : Get all order history of  a user
  const userHistory = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "orders",
        localField: "orderHistory",
        foreignField: "_id",
        as: "orderHistory",
        pipeline: [
          {
            $lookup: {
              from: "products",
              localField:"orderHistory",
              foreignField:"_id",
              as:"orderHistory"
            },
          },
        ],
      },
    },
  ]);
  
  return res
  .status(200)
  .json(new ApiResponse(200, userHistory, "Order History fetched successfully"))
});

export {
  registration,
  login,
  logout,
  refreshRefreshToken,
  changeCurrentPassword,
  updateAvatar,
  getCurrentUser,
  updateAccountDetails,
  getUserOrderHistory
};
