import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoute from "./routes/authRoutes.js";
import searchRoute from "./routes/searchRoutes.js";
import messageRoute from "./routes/messageRoutes.js";
import userRoute from "./routes/userRoutes.js";
import channelRoute from "./routes/channelRoutes.js";
import { setupSocket } from "./socket/socket.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/search", searchRoute);
app.use("/api/messages", messageRoute);
app.use("/api/users", userRoute);
app.use("/api/channels", channelRoute);

const server = app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
  connectDB();
});

setupSocket(server);
