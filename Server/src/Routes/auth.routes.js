import { Router } from "express";
import { googleAuth, signin, signOut, signup } from "../Controllers/auth.controller.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/google").post(googleAuth);
router.route("/signout").post(signOut);

export default router;
