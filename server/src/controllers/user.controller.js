import { User } from "../models/user.models.js";
import asyncHandler from "express-async-handler";

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if ([username, email, password].some((fields) => fields === undefined)) {
      return res.status(400).json({ errorMessage: "All fields are required" });
    }
    const containsUppercase = (str) => {
      for (let i = 0; i < str.length; i++) {
        if (str[i] >= "A" && str[i] <= "Z") {
          return true; // Found an uppercase letter
        }
      }
      return false; // No uppercase letter found
    };
    const usernameContainUpperCase = containsUppercase(username);
    const emailContainUpperCase = containsUppercase(email);
    if (usernameContainUpperCase || emailContainUpperCase) {
      return res.status(400).json({
        errorMessage: "All inputs should be in lowercase",
      });
    }
    if (username.includes(" ") || email.includes(" ")) {
      return res.status(400).json({
        errorMessage: "Inputs should not contain a space",
      });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ errorMessage: "Password must be atleast 6 character" });
    }
    if (!email.includes("@")) {
      return res.status(400).json({ errorMessage: "Invalid email" });
    }
    const isUserExists = await User.findOne({
      $or: [{ username }, { email }],
    }).select("-password");

    if (isUserExists) {
      return res
        .status(400)
        .json({ errorMessage: "Username or email already taken." });
    }
    const user = await User.create({
      username,
      email,
      password,
    });

    if (!user) {
      return res.status(500).json({ errorMessage: "User not created" });
    }

    return res
      .status(200)
      .json({ user, message: "User successfully registered" });
  } catch (error) {
    return res.status(500).send({
      errorMessage: "User registration unsuccessful: ",
      error: error.message,
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username && !email) {
      return res
        .status(400)
        .send({ errorMessage: "Username or email is required" });
    }
    if (!password) {
      return res.status(400).send({ errorMessage: "Password is required" });
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
      return res.status(400).send({
        errorMessage: "User with this username or email doesn't exists",
      });
    }
    const passwordCheck = await user.passwordCompare(password);
    if (!passwordCheck) {
      return res.status(400).json({ errorMessage: "Invalid credentials" });
    }
    const token = await user.generateToken();

    if (!token) {
      return res
        .status(500)
        .send({ message: "Error while generating access token" });
    }

    const loggedInUser = await User.findById(user._id).select("-password");
    return res
      .status(200)
      .cookie("token", token, { httpOnly: true })
      .send({ loggedInUser, message: "User successfully logged in" });
  } catch (error) {
    return res
      .status(400)
      .send({ errorMessage: "Login unsuccessful", error: error.message });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("token", { httpOnly: true, secure: true })
    .send({ message: "User logged out" });
});

const userProfile = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ errorMessage: "User not found" });
    }
    if (req.method === "GET") {
      const userProfile = {
        id: user._id,
        username: user.username,
        email: user.email,
      };

      return res.status(200).send(userProfile);
    } else if (req.method === "PUT" || req.method === "PATCH") {
      const { username, email, password, newPassword } = req.body;
      console.log(req.body);
      if (password && newPassword) {
        const passwordCheck = await user.passwordCompare(password);
        if (!passwordCheck) {
          return res
            .status(400)
            .send({ errorMessage: "Invalid currrent password" });
        }
        if (newPassword.length < 6) {
          return res
            .status(400)
            .send({ errorMessage: "Password must be atleast 6 character" });
        }
        user.password = newPassword;
      }
      if (username) {
        if (user.username === username) {
          return res.status(400).send({
            errorMessage: "Updated username cannot match the previous one",
          });
        }
        const isUserExists = await User.findOne({
          username,
        });

        if (isUserExists) {
          return res
            .status(400)
            .send({ errorMessage: "Username is already taken." });
        }
        user.username = username;
      }
      if (email) {
        if (!email?.includes("@")) {
          return res.status(400).send({ errorMessage: "Invalid email" });
        }
        user.email = email;
      }

      await user.save();

      return res
        .status(200)
        .send({ message: "User profile updated succesfully" });
    }
  } catch (error) {
    console.log(`Error while fetching/updating user information`, error);
    return res
      .status(500)
      .send({ errorMessage: "Internal server error", error: error.message });
  }
});

export { registerUser, loginUser, logoutUser, userProfile };
