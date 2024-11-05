import { Router } from "express";
import {
  deleteUser,
  getUser,
  getUserListings,
  updateUser,
} from "../Controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/update/:id")
  .post(verifyJWT, upload.single("avatar"), updateUser);
router.route("/delete/:id").delete(verifyJWT, deleteUser);
router.route("/listings/:id").get(verifyJWT, getUserListings);
router.route("/:id").get(verifyJWT, getUser);

export default router;
