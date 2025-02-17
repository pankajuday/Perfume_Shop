import { Router } from "express";
import { addOnWishList, getWishList, likedOnReview } from "../controllers/like.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";


const router = Router();

router.use(verifyJwt);

router.route("/").get(getWishList);
router.route("/r/:reviewId").post(likedOnReview);
router.route("/p/:productId").post(addOnWishList);


export default router;