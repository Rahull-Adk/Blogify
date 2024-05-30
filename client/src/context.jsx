import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get("/users/profile", {
          withCredentials: true,
        });
        if (data) {
          setUserInfo(data);
        }
      } catch (error) {
        setUserInfo(null);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    // Correctly place the function call here
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, loading }}>
      {children}
    </UserContext.Provider>
  );
};
