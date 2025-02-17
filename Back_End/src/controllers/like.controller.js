import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const likedOnReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const user = req.user?._id;
  if (!user) throw new ApiError(401, "Unauthorized user");
  if (!reviewId) throw new ApiError(401, "Review id is required");
  if (!isValidObjectId(reviewId)) throw new ApiError(401, "Review id is inValid");

  const isLiked = await Like.findOne({
    $and: [{ review: reviewId }, { likedBy: user }],
  });

  if (!isLiked) {
    const likedOnReview = await Like.create({
      review: reviewId,
      likedBy: user,
    });

    res.status(200).json(new ApiResponse(200, likedOnReview, "Successfully liked"));
  }
  if (isLiked) {
    await Like.findByIdAndDelete(isLiked._id);
    return res.status(200).json(new ApiResponse(200, {}, " sucessfully Unliked"));
  }
});

const addOnWishList = asyncHandler(async (req, res) => { // Liked product
    const { productId } = req.params;
    const user = req.user?._id;
    if (!user) throw ApiError(401, "Unauthorized user");
    if (!productId) throw ApiError(401, "Review id is required");
    if (!isValidObjectId(productId)) throw ApiError(401, "Review id is inValid");
  
    const isLiked = await Like.findOne({
      $and: [{ product: productId }, { likedBy: user }],
    });
   
    
    if (isLiked) {
      await Like.findByIdAndDelete(isLiked._id);
      return res.status(200).json(new ApiResponse(200, {}, " sucessfully removed from wishlist"));
    }

    if (!isLiked) {
      const likedOnReview = await Like.create({
        product: productId,
        likedBy: user,
      });
  
      res.status(200).json(new ApiResponse(200, likedOnReview, "Successfully added on wishlist"));
    }
    
});

const getWishList = asyncHandler(async (req, res) => {  // get liked product of user 
    
  const user = req.user?._id;
  if (!user) throw ApiError(401, "Unauthorized user");

  const wishList = await Like.aggregate([
    {
      $match:{
          likedBy: new mongoose.Types.ObjectId(user)
       }
    },
    {
      $lookup:{
          from:"products",
          localField:"product",
          foreignField:"_id",
          as:"product",
          pipeline:[
            {
              $project:{
                name:1,
                title:1,
                brand:1,
                price:1,
                logo:1,
                category:1,
              }
            }
          ]

      }
    }
    ,
    {
      $unwind:"$product"
    }
    
  ])

  res.status(200).json(
    new ApiResponse(200, wishList, "Successfully fetched wishList")
  )

});

export { likedOnReview, addOnWishList, getWishList };
