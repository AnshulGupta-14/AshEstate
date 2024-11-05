import { Router } from "express";
import {
  createListing,
  deleteListing,
  getListing,
  getListings,
  updateListing,
} from "../Controllers/listing.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/create")
  .post(verifyJWT, upload.array("images", 10), createListing);
router.route("/delete/:id").delete(verifyJWT, deleteListing);
router
  .route("/update/:id")
  .post(verifyJWT, upload.array("images", 10), updateListing);
router.route("/get/:id").get(getListing);
router.route("/get").get(getListings);

export default router;
