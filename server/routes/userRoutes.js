import express from "express";
import {
  test,
  updateInfo,
  updatePassword,
} from "../controllers/userController.js";

const router = express.Router();

router.put("/:id", updateInfo);
router.put("/password/:id", updatePassword);

export default router;
