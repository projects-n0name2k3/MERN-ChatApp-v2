import express from "express";
import {
  createChannel,
  getChannelMessages,
  getChannels,
} from "../controllers/channelController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/create", verifyToken, createChannel);
router.get("/", verifyToken, getChannels);
router.get("/messages/:id", verifyToken, getChannelMessages);
export default router;
