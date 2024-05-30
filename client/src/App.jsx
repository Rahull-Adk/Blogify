import React from "react";
import Home from "./components/Home.jsx";
import "./App.css";
import Register from "./pages/Register.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreatePost from "./pages/CreatePost.jsx";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import axios from "axios";
import { UserContextProvider } from "./context.jsx";
import PostPage from "./pages/PostPage.jsx";
import EditPost from "./pages/EditPost.jsx";
axios.defaults.baseURL = "http://localhost:4000/api/v1";
axios.defaults.withCredentials = true;
const App = () => {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
};

export default App;
