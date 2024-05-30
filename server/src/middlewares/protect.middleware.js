import asyncHandler from "express-async-handler";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

const protectRoutes = asyncHandler(async (req, res, next) => {
  try {
    if (req.method === "GET") {
      const token =
        req.cookies?.token ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).send({ errorMessage: "getUnauthorize request" });
      }
    }
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).send({ errorMessage: "Unauthorize request" });
    }
    const decodedToken = jwt.verify(token, process.env.ACCESSTOKENSECRET);

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(401).send({ errorMessage: "Invalid token" });
    }
    req.user = user;

    next();
  } catch (error) {
    return res
      .status(401)
      .send({ errorMessage: error?.message || "Invalid tokens" });
  }
});

export default protectRoutes;
