import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  } else {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
});

userSchema.methods.passwordCompare = async function (password) {
  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw error;
  }
};
userSchema.methods.generateToken = async function () {
  const payload = { id: this._id };
  if (this.username) {
    payload.username = this.username;
  }
  if (this.email) {
    payload.email = this.email;
  }
  return jwt.sign(payload, process.env.ACCESSTOKENSECRET, {
    expiresIn: "30d",
  });
};

export const User = mongoose.model("User", userSchema);
