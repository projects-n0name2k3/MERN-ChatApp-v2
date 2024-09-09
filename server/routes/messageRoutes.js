import express from "express";
import {
  getContactsFromDMList,
  getMessages,
} from "../controllers/mesageController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/get-messages", getMessages);
router.get("/get-contacts", verifyToken, getContactsFromDMList);

export default router;
