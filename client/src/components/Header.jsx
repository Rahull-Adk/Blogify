import React, { useContext } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { UserContext } from "../context.jsx";

const Header = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo, loading } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "/users/logout",
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.message) {
        toast.success(response.data.message);
        setUserInfo(null);
        navigate("/");
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
  if (loading) {
    return null;
  }

  return (
    <header>
      <Link to="/" className="logo">
        Blogify
      </Link>
      <nav>
        {userInfo ? (
          <>
            <Link to="/create">Create a new post</Link>
            <a onClick={handleLogout}>Logout</a>
          </>
        ) : (
          <>
            <Link to="/login" className="text-xl font-bold">
              Login
            </Link>
            <Link to="/register" className="text-xl font-bold">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
