import React, { useEffect, useState } from "react";
import axios from "../Utils/Axios";
import { NavLink } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
        setLoading(false);
        setMessage("");
    }, 4000);
  };

  useEffect(() => {
    axios
      .get(`/users/${listing.user}`)
      .then((res) => setLandlord(res.data))
      .catch((err) => setError(err.response.data.message || err.message));
  }, [listing.user]);

  return (
    <>
      {error && <p className="text-red-500 font-semibold">{error}</p>}
      {landlord && !error && (
        <div className="flex flex-col gap-2">
          <p className="px-2">
            Contanct <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.title.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id=""
            rows={"3"}
            placeholder="Enter tour message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded-lg"
          ></textarea>

          <NavLink
            to={`mailto:${landlord.email}?subject=Regarding ${listing.title}&body=${message}`}
            className="p-3 bg-slate-800 text-white text-center rounded-xl uppercase"
            onClick={handleClick}
          >
            {loading ? "Sending..." : "Send Message"}
          </NavLink>
        </div>
      )}
    </>
  );
};

export default Contact;
