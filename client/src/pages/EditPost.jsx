import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

const EditPost = () => {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/users/post/${id}`);
        if (data) {
          setTitle(data.title);
          setContent(data.content);
          setSummary(data.summary);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  const updatePost = async (e) => {
    e.preventDefault();
    const dataForm = new FormData();
    dataForm.set("title", title);
    dataForm.set("summary", summary);
    dataForm.set("id", id);
    dataForm.set("content", content);
    if (file) {
      dataForm.append("file", file);
    }

    try {
      const data = await axios.put(`/users/post`, dataForm);
      if (data) {
        console.log("FE rs: ", data);
        navigate("/post/" + id);
      }
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

  return (
    <form onSubmit={updatePost}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full block border-2 p-2 border-gray-500 rounded-lg py-2 mt-2 outline-none"
      />
      <textarea
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className="w-full block border-2 p-2 border-gray-500 rounded-lg py-2 mt-2 outline-none"
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full block border-2 p-2 border-gray-500 rounded-lg py-2 mt-2 outline-none mb-2"
      />
      <ReactQuill
        value={content}
        onChange={(newValue) => setContent(newValue)}
        modules={modules}
        formats={formats}
      />
      <button className="w-full block bg-gray-700 outline-none border-0 text-white rounded-lg py-2 mt-2">
        Edit Post
      </button>
    </form>
  );
};

export default EditPost;
