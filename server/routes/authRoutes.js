import express from "express";
import {
  activeEmail,
  authMiddleware,
  loginByGoogle,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  sendLinkToResetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/active/:verifyToken", activeEmail);
router.post("/login", loginUser);
router.post("/google/login", loginByGoogle);
router.post("/logout", logoutUser);
router.post("/forgot-password", sendLinkToResetPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});

export default router;
