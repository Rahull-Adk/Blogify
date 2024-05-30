import mongoose from "mongoose";
import { dbName } from "../../constant.js";
import { app } from "../../app.js";
const connectDB = async () => {
  try {
    const connnectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${dbName}`
    );
    app.on("error", () => {
      process.exit(1);
    });
    console.log(
      "Mongo Database connected successfully: ",
      connnectionInstance.connection.host
    );
  } catch (error) {
    console.log("Mongo Database connection failed", error);
  }
};

export default connectDB;
