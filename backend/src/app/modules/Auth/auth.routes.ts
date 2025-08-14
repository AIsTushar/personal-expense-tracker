import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";
import auth from "../../middlewares/auth";
import passport from "passport";

const router = Router();

router.post(
  "/register",
  validateRequest(authValidation.UserRegisterValidationSchema),
  AuthController.register
);

router.post("/verify-email", AuthController.verifyEmail);
router.post(
  "/login",
  validateRequest(authValidation.UserLoginValidationSchema),
  AuthController.login
);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password/:token", AuthController.resetPassword);

router.post("/change-password", auth(), AuthController.changePassword);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/resend-verify-email-token", AuthController.resendVerifyEmail);
router.post("/make-admin", AuthController.makeAdmin);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  AuthController.handleGoogleCallback
);

export const AuthRoutes = router;
