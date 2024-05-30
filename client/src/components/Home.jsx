import React, { useEffect, useState } from "react";
import Post from "./Post.jsx";
import axios from "axios";
import toast from "react-hot-toast";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axios.get("/users/post");
        const { data } = response;
        console.log(data);
        setPosts(data);
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errorMessage
        ) {
          toast.error(error.response.data.errorMessage);
        } else {
          console.log("Unknown error occurred", error);
        }
      }
    };

    getProfile();
  }, []);

  return (
    <>
      {posts.length > 0 && posts.map((post, i) => <Post {...post} key={i} />)}
    </>
  );
};

export default Home;
