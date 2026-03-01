import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, getErrorMessage } from "../lib/axios";

const AuthContext = createContext(null);
const TOKEN_KEY = "contestforge-token";

const saveAuth = ({ token, user }, setAppUser) => {
  if (!token || !user) {
    throw new Error("Invalid auth response");
  }
  localStorage.setItem(TOKEN_KEY, token);
  setAppUser(user);
};

export const AuthProvider = ({ children }) => {
  const [appUser, setAppUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const boot = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        setAppUser(res.data?.data || null);
      } catch (_error) {
        localStorage.removeItem(TOKEN_KEY);
        setAppUser(null);
      } finally {
        setLoading(false);
      }
    };

    boot();
  }, []);

  const refreshSession = async () => {
    const res = await api.get("/auth/me");
    setAppUser(res.data?.data || null);
    return res.data?.data;
  };

  const signUp = async ({ name, email, password, photoURL }) => {
    const res = await api.post("/auth/register", { name, email, password, photoURL });
    saveAuth(res.data?.data, setAppUser);
    return res.data?.data?.user;
  };

  const signIn = async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    saveAuth(res.data?.data, setAppUser);
    return res.data?.data?.user;
  };

  const demoLogin = async (role = "user") => {
    const res = await api.post("/auth/demo-login", { role });
    saveAuth(res.data?.data, setAppUser);
    return res.data?.data?.user;
  };

  const signInWithGoogle = async () => {
    throw new Error("Google login is not enabled in this build");
  };

  const logOut = async () => {
    localStorage.removeItem(TOKEN_KEY);
    setAppUser(null);
    toast.success("Logged out");
  };

  const value = {
    user: appUser,
    role: appUser?.role || null,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    demoLogin,
    logOut,
    refreshSession,
    token: localStorage.getItem(TOKEN_KEY),
    getErrorMessage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
