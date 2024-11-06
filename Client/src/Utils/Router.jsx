import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Components/Home";
import About from "../Components/About";
import SignIn from "../Components/SignIn";
import SignUp from "../Components/SignUp";
import Profile from "../Components/Profile";
import PrivateRoute from "../Components/PrivateRoute";
import CreateListing from "../Components/CreateListing";
import UpdateListing from "../Components/UpdateListing";
import Listing from "../Components/Listing";
import Search from "../Components/Search";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/about" element={<About />}></Route>
      <Route path="/sign-in" element={<SignIn />}></Route>
      <Route path="/sign-up" element={<SignUp />}></Route>
      <Route path="/listing/:id" element={<Listing />}></Route>
      <Route path="search" element={<Search />}></Route>
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/create-listing" element={<CreateListing />}></Route>
        <Route path="/update-listing/:id" element={<UpdateListing />}></Route>
      </Route>
    </Routes>
  );
};

export default Router;
