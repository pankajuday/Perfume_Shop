import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserOrderHistory,
  login,
  logout,
  refreshRefreshToken,
  registration,
  updateAccountDetails,
  updateAvatar,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/registration").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registration
);

router.route("/login").post(login);

// Authorized Access
router.route("/logout").get(verifyJwt,logout);
router.route("/refreshToken").post(verifyJwt, refreshRefreshToken);
router.route("/changeCurrentPassword").post(verifyJwt, changeCurrentPassword);
router.route("/updateAvatar").patch(verifyJwt, updateAvatar);
router.route("/currentUser").get(verifyJwt, getCurrentUser);
router.route("updateAccountDetails").patch(verifyJwt, updateAccountDetails);

router.route("/orderHistory").get(verifyJwt, getUserOrderHistory); // TODO:

export default router;
