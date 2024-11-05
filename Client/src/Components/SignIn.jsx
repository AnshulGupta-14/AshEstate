import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../Utils/Axios";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../Redux/User/UserSlice";
import Oauth from "./Oauth";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  // const [loading, setLoading] = useState("");

  const handleSubmit = (e) => {
    dispatch(updateUserStart());
    const url = "/auth/signin";
    const data = { email, password };

    axios
      .post(url, data)
      .then((res) => {
        dispatch(updateUserSuccess(res.data.rest));
        navigate("/");
      })
      .catch((err) => {
        dispatch(updateUserFailure(err.response.data.message));
      });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-7">Sign In</h1>
      <div className="flex flex-col gap-5 w-1/2 mx-auto">
        <input
          type="email"
          placeholder="Email"
          className="border border-black rounded-lg p-3"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-black rounded-lg p-3"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          disabled={loading}
          className="bg-blue-500 text-white font-bold rounded-lg p-3 uppercase"
          onClick={handleSubmit}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        <Oauth></Oauth>
        <p>
          Don't have an account?{" "}
          <span
            className="text-blue-600 ml-2 cursor-pointer"
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </span>
        </p>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default SignIn;
