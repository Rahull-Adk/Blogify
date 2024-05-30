import express from "express";
import protectRoutes from "../middlewares/protect.middleware.js";
import {
  createPost,
  eachPost,
  getPosts,
  updatePost,
} from "../controllers/post.controller.js";
import {
  loginUser,
  logoutUser,
  registerUser,
  userProfile,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/fileUpload.middleware.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

router
  .route("/profile")
  .get(protectRoutes, userProfile)
  .put(protectRoutes, userProfile)
  .patch(protectRoutes, userProfile);

router
  .route("/post")
  .post(protectRoutes, upload.single("file"), createPost)
  .get(getPosts)
  .put(protectRoutes, upload.single("file"), updatePost);

router.route("/post/:id").get(eachPost);

export default router;
