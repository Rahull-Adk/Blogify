import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { UserContext } from "../context.jsx";
import { format } from "date-fns";
const PostPage = () => {
  const { id } = useParams();
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  useEffect(() => {
    try {
      const fetchData = async () => {
        const { data } = await axios.get(`/users/post/${id}`);
        if (data) {
          setPostInfo(data);
        }
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, [id, userInfo]);
  if (!postInfo) return "";
  return (
    <div className="post-page">
      <h1 className="font-bold text-2xl mb-5">{postInfo.title}</h1>
      <time>
        {
          <time>
            {format(new Date(postInfo.createdAt), "MMM d, yyyy HH:mm")}
          </time>
        }
      </time>
      <div className="author">by {postInfo.author.username}</div>
      <div className="edit-row">
        <Link to={`/edit/${postInfo._id}`}>
          {userInfo?.id === postInfo.author._id && <a>Edit this post</a>}
        </Link>
      </div>
      <div className="image">
        <img src={`http://localhost:4000/${postInfo.cover}`} alt="" />
      </div>
      <div
        className=" text-2xl mt-5"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
  );
};

export default PostPage;
