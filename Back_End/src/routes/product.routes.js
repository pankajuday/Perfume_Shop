import e, { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addProduct, deleteProduct, getAllProduct, getProductById, updateProduct } from "../controllers/product.controller.js";

const router = Router();

router.use(verifyJwt);

router.route("/")
.get(getAllProduct)
.post(
  upload.fields([
    {
      name: "images",
      maxCount: 5,
    },
    
  ]),
  addProduct
);

router.route("/:productId").patch(updateProduct).get(getProductById).delete(deleteProduct);



export default router;