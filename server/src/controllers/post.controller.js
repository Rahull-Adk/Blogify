import asyncHandler from "express-async-handler";
import { Post } from "../models/post.models.js";
import fs from "fs";

const createPost = asyncHandler(async (req, res) => {
  const { title, summary, content } = req.body;

  if ([title, summary, content].some((field) => field.trim() === "")) {
    return res.status(400).json({ errorMessage: "All fields are required" });
  }

  const { originalname, path: tempPath } = req.file;
  const parts = originalname.split(".");
  console.log(originalname);
  const ext = parts[parts.length - 1];
  const newPath = `${tempPath}.${ext}`.replace(/\\/g, "/");
  fs.renameSync(tempPath, newPath);
  console.log(newPath);

  const user = req.user;
  const postDoc = await Post.create({
    title,
    summary,
    content,
    cover: newPath,
    author: user._id,
  });

  return res
    .status(200)
    .send({ message: "Post created successfully", postDoc });
});

const updatePost = asyncHandler(async (req, res) => {
  const { id, title, summary, content } = req.body;
  let newPath = null;
  if (req.file) {
    const { originalname, path: tempPath } = req.file;
    const parts = originalname.split(".");
    console.log(originalname);
    const ext = parts[parts.length - 1];
    newPath = `${tempPath}.${ext}`.replace(/\\/g, "/");
    fs.renameSync(tempPath, newPath);
  }
  const user = req.user;
  console.log(user._id);
  const postDoc = await Post.findById(id);
  const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(user._id);
  if (!isAuthor) {
    return res.status(400).json("You are not the author");
  } else {
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });
  }
  res.json(postDoc);
});

const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);

  return res.status(200).json(posts);
});

const eachPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

export { createPost, getPosts, eachPost, updatePost };
