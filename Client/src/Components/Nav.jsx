import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    } else {
      setSearchTerm("");
    }
  }, [location.search]);

  return (
    <div className="flex justify-around items-center p-3 bg-gray-500">
      <NavLink to={"/"}>
        <span>Ash</span>
        <span>Estate</span>
      </NavLink>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search"
          className="p-3 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <div className="flex gap-7 items-center">
        <NavLink to={"/"}>Home</NavLink>
        <NavLink to={"/about"}>About</NavLink>
        <NavLink to={"/profile"}>
          {currentUser ? (
            <img
              src={currentUser.avatar}
              alt="Profile"
              className="rounded-full w-10 h-10"
            />
          ) : (
            <h1>Sign in</h1>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default Nav;
