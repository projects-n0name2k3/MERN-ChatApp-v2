import express from "express";
import {
  getAllUsers,
  searchUserByEmailOrUsername,
} from "../controllers/searchController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/:search", verifyToken, searchUserByEmailOrUsername);
router.get("/", verifyToken, getAllUsers);

export default router;
