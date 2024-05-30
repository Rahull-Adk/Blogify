import express from "express";
import userRouter from "./src/routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
const app = express();
app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use("/uploads", express.static(path.resolve("uploads")));
app.use(cors({ origin: `${process.env.CORS_ORIGIN}`, credentials: true }));

app.use("/api/v1/users", userRouter);

export { app };
