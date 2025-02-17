import { addReview, deleteReview, getAllReviews } from "../controllers/review.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";




const router = Router();

router.use(verifyJwt);


router.route("/:productId").post(
    upload.fields([
        {
            name:"images",
            maxCount:3
        }
    ]),
    addReview
).get(getAllReviews);
router.route("/r/:reviewId").delete(deleteReview);





export default router;