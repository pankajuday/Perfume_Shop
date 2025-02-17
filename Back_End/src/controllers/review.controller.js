import mongoose, { isValidObjectId } from "mongoose";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { Review } from "../models/review.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addReview = asyncHandler(async (req, res) => {
  const { content, ratings } = req.body;
  const { productId } = req.params;
  const user = req.user?._id;

  if ([content, ratings].some((field) => field === ""))
    throw new ApiError(401, "Content and Rating Required");

  if (!productId) throw new ApiError(404, "product is not found");
  if (!user) throw new ApiError(401, "Unauthorize access");

  const uploaderPromise = req.files?.images.map(async (i) => {
    return await uploadOnCloudinary(i?.path);
  });

  const resolvedUploader = await Promise.all(uploaderPromise);
  const imgUrl = resolvedUploader.map((u, idx) => {
    return u?.url;
  });
  const addReview = await Review.create({
    content: content,
    ratings: ratings,
    product: new mongoose.Types.ObjectId(productId),
    user: user,
    images: imgUrl,
  });

  res.status(200).json(new ApiResponse(200, addReview, "Successfully added Review"));
});

const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const user = req.user?._id;

  if (!reviewId) throw new ApiError(401, "reivew id is require");
  if (!isValidObjectId(reviewId)) throw new ApiError(401, "reivew id is INVALID");
  if (!user) throw new ApiError(401, "Unauthorize access");

  const isExist = await Review.findOne({
    $and: [{ user: user }, { _id: reviewId }],
  });

  if (!isExist) throw new ApiError(404, "review not found");

  if (isExist) {
    await Review.findByIdAndDelete(isExist);
  }

  res.status(200).json(new ApiResponse(200, {}, "  review deleted successfully"));
});

const updateReview = asyncHandler(async (req, res) => {
  const { content, ratings } = req.body;
  const { reviewId } = req.params;
  const user = req.user?._id;

  if ([content, ratings].some((field) => field === ""))
    throw new ApiError(401, "Content and Rating Required");

  if (!reviewId) throw new ApiError(404, "review is not found");
  if (!user) throw new ApiError(401, "Unauthorize access");
});

const getAllReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  if (!productId) throw new ApiError(401, "product id is required");
  if (!isValidObjectId(productId)) throw new ApiError(401, "Product id is inValid");

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const allReview = await Review.aggregate([
    {
      $match: {
        product: productId,
      },
    },
  ]);

  const allReviewPagg = await Review.aggregatePaginate(allReview, options);

  res.status(200).json(new ApiResponse(200, allReviewPagg, "successfully fetched all comments"));
});

export { addReview, deleteReview, getAllReviews, updateReview };
