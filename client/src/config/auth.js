import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";
import axios from "axios";

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const res = await signInWithPopup(auth, provider);
    const formData = {
      email: res.user.email,
      username: res.user.displayName,
      image: res.user.photoURL,
    };
    if (res.user.accessToken) {
      const result = await axios.post(
        "http://localhost:3000/api/auth/google/login",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return result;
    }
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};
