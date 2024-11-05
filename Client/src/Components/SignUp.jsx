import React, { useState } from "react";
import axios from "../Utils/Axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const handleSubmit = (e) => {
    setLoading(true);
    const url = "/auth/signup";
    const data = { username, email, password };

    axios
      .post(url, data)
      .then(() => {
        navigate("/sign-in");
      })
      .catch((err) => {
        setError(err.response.data.message);
      })
      .finally(() => setLoading(false));
  };
  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-7">Sign Up</h1>
      <div className="flex flex-col gap-5 w-1/2 mx-auto">
        <input
          type="text"
          placeholder="Username"
          className="border border-black rounded-lg p-3"
          onChange={(e) => setUsername(e.target.value)}
        />
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
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <p>
          Have an account?{" "}
          <span
            className="text-blue-600 ml-2 cursor-pointer"
            onClick={() => navigate("/sign-in")}
          >
            Sign In
          </span>
        </p>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default SignUp;
