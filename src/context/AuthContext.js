import React, { createContext, useState } from "react";
import { getTokens, saveTokens, removeTokens } from "../helpers/tokenManager";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // * Check if the user is logged in by verifying tokens
  const checkLogin = async () => {
    const { accessToken } = await getTokens();
    setIsLoggedIn(!!accessToken);
  };

  // * Log in the user and save tokens
  const login = async (accessToken, refreshToken) => {
    await saveTokens(accessToken, refreshToken);
    setIsLoggedIn(true);
  };

  // * Log out the user and remove tokens
  const logout = async () => {
    await removeTokens();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, checkLogin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};