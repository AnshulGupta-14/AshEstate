import React, { useEffect } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../FireBase";
import axios from "../Utils/Axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../Redux/User/UserSlice";

const Oauth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const handleGoogle = async () => {
    dispatch(updateUserStart());
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const data = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      };
      axios.post("/auth/google", data).then((res) => {
        dispatch(updateUserSuccess(res.data.rest));
        navigate("/");
      });
    } catch (err) {
      dispatch(updateUserFailure("Try again"));
    }
  };

  return (
    <button
      disabled={loading}
      onClick={handleGoogle}
      className="p-3 bg-zinc-600 text-white rounded-lg uppercase font-bold"
    >
      {loading ? "Loading..." : "Continue with Google"}
    </button>
  );
};

export default Oauth;
