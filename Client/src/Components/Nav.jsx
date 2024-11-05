import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Nav = () => {
  const { currentUser } = useSelector((state) => state.user);
  // console.log(currentUser.avatar);
  
  return (
    <div className="flex justify-around items-center p-3 bg-gray-500">
      <NavLink to={"/"}>
        <span>Ash</span>
        <span>Estate</span>
      </NavLink>
      <input type="text" placeholder="Search" className="p-3 rounded-md" />
      <div className="flex gap-7 items-center">
        <NavLink to={"/"}>Home</NavLink>
        <NavLink to={"/about"}>About</NavLink>
        <NavLink to={"/profile"}>
          {currentUser ? (
            <img src={currentUser.avatar} alt="Profile" className="rounded-full w-10 h-10"/>
          ) : (
            <h1>Sign in</h1>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default Nav;
