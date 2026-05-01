import { createContext, useContext, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

const getStoredUser = () => {
  const rawUser = localStorage.getItem("teamTaskUser");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem("teamTaskUser");
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("teamTaskToken"));
  const [user, setUser] = useState(getStoredUser);

  const saveSession = ({ token: nextToken, user: nextUser }) => {
    localStorage.setItem("teamTaskToken", nextToken);
    localStorage.setItem("teamTaskUser", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    saveSession(response.data.data);
    return response.data;
  };

  const signup = async (payload) => {
    const response = await api.post("/auth/register", payload);
    saveSession(response.data.data);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("teamTaskToken");
    localStorage.removeItem("teamTaskUser");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token && user),
      token,
      user,
      login,
      signup,
      logout
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
