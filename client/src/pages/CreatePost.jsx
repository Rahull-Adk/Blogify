import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState("");
  const navigate = useNavigate();

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const createNewPost = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.set("title", title);
      data.set("summary", summary);
      data.set("content", content);
      data.set("file", file[0]);
      const response = await axios.post("/users/post", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const postData = response.data;

      if (postData && postData.message) {
        toast.success(postData.message);
        navigate("/");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.errorMessage &&
        error.response.data.errorMessage === "Unauthorize request"
      ) {
        toast.error(error.response.data.errorMessage + " Please login again");
        navigate("/login");
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.errorMessage
      ) {
        toast.error(error.response.data.errorMessage);
      } else {
        toast.error("Unknown error occur");
        console.log(error);
      }
    }
  };
  return (
    <form onSubmit={createNewPost}>
      <input
        type="title"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full block border-2 p-2 border-gray-500  rounded-lg py-2 mt-2 ouline-none"
      />
      <input
        type="summary"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className="w-full block border-2 p-2 border-gray-500 rounded-lg py-2 mt-2 outline-none"
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files)}
        className=" w-full
       block
       border-2
       p-2
       border-gray-500
       rounded-lg
       py-2
       mt-2 outline-none mb-2"
      />
      <ReactQuill
        value={content}
        onChange={(newValue) => setContent(newValue)}
        modules={modules}
        formats={formats}
      />
      <button className="w-full block bg-gray-700 ouline-none border-0 text-white rounded-lg py-2 mt-2">
        Create Post
      </button>
    </form>
  );
};

export default CreatePost;
