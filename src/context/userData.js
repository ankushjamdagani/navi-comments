import { createContext, useContext, useEffect, useState } from "react";
import UserAPI from "../api/user";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    UserAPI.getUserData().then((res) => {
      setUserData(res);
    });
  }, []);

  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  );
};
