import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import toast from "react-hot-toast";
import { firebaseAuth } from "../firebase/firebase.config";
import { api, getErrorMessage } from "../lib/axios";

const AuthContext = createContext(null);

const TOKEN_KEY = "contestforge-token";
const auth = firebaseAuth;
const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [appUser, setAppUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const exchangeJwt = useCallback(async (firebaseUser) => {
    const firebaseToken = await firebaseUser.getIdToken();
    const name = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Contest User";
    const email = firebaseUser.email || "";
    const photoURL = firebaseUser.photoURL || "https://i.ibb.co/4Y5J8z0/profile.png";
    const res = await api.post("/auth/jwt", { firebaseToken, name, email, photoURL });

    const token = res.data?.data?.token;
    const user = res.data?.data?.user;

    if (!token || !user) {
      throw new Error("Failed to exchange Firebase token");
    }

    localStorage.setItem(TOKEN_KEY, token);
    setAppUser(user);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        localStorage.removeItem(TOKEN_KEY);
        setAppUser(null);
        setLoading(false);
        return;
      }

      try {
        await exchangeJwt(firebaseUser);
      } catch (error) {
        toast.error(getErrorMessage(error, "Login session restore failed"));
        localStorage.removeItem(TOKEN_KEY);
        setAppUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [exchangeJwt]);

  const refreshSession = useCallback(async () => {
    if (!auth.currentUser) {
      throw new Error("No authenticated Firebase user");
    }
    await exchangeJwt(auth.currentUser);
  }, [exchangeJwt]);

  const signUp = async ({ name, email, password, photoURL }) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, {
      displayName: name,
      photoURL: photoURL || "https://i.ibb.co/4Y5J8z0/profile.png",
    });
    await exchangeJwt(credential.user);
    return credential.user;
  };

  const signIn = async ({ email, password: _password }) => {
    const credential = await signInWithEmailAndPassword(auth, email, _password);
    await exchangeJwt(credential.user);
    return credential.user;
  };

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await exchangeJwt(result.user);
    return result.user;
  };

  const logOut = async () => {
    await signOut(auth);
    localStorage.removeItem(TOKEN_KEY);
    setAppUser(null);
    toast.success("Logged out");
  };

  const value = useMemo(
    () => ({
      user: appUser,
      role: appUser?.role || null,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      logOut,
      refreshSession,
    }),
    [appUser, loading, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
