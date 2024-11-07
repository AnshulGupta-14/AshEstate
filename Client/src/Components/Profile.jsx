import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../Utils/Axios";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../Redux/User/UserSlice";
import { NavLink, useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [success, setSuccess] = useState(false);
  const [listing, setListing] = useState([]);
  const [listingError, setListingError] = useState(null);
  const [showListings, setShowListings] = useState(false);
  const [deleteListings, setDeleteListings] = useState(false);

  const handleUpdate = () => {
    console.log(avatar);
    dispatch(updateUserStart());
    const data = new FormData();
    data.append("username", username);
    data.append("email", email);
    data.append("avatar", avatar);
    data.append("password", password);

    axios
      .post(`/users/update/${currentUser._id}`, data)
      .then((res) => {
        dispatch(updateUserSuccess(res.data));
        setSuccess(true);
      })
      .catch((err) => {
        dispatch(updateUserFailure(err.response.data.message));
        setSuccess(false);
      });
  };

  const deleteUser = () => {
    dispatch(updateUserStart());
    axios
      .delete(`/users/delete/${currentUser._id}`)
      .then(() => {
        dispatch(updateUserSuccess(null));
        navigate("/sign-in");
      })
      .catch((err) => {
        dispatch(updateUserFailure(err.response.data.message));
        setSuccess(false);
      });
  };

  const logOut = () => {
    dispatch(updateUserStart());
    axios
      .post("/auth/signout")
      .then(() => {
        dispatch(updateUserSuccess(null));
        navigate("/sign-in");
      })
      .catch((err) => {
        dispatch(updateUserFailure(err.response.data.message));
        setSuccess(false);
      });
  };

  const handleShowListings = () => {
    axios
      .get(`/users/listings/${currentUser._id}`)
      .then((res) => {
        setListing(res.data);
        setShowListings(true);
      })
      .catch((err) => {
        setListingError(err.response.data.message);
      });
  };

  const handleDeleteListing = (e, id) => {
    e.preventDefault();
    axios
      .delete(`/listings/delete/${id}`)
      .then(() => {
        setListing(listing.filter((item) => item._id !== id));
        setDeleteListings(true);
      })
      .catch((err) => {
        setListingError(err.response.data.message);
        setDeleteListings(false);
      });
  };

  return (
    <div className="pb-5">
      <h1 className="text-3xl text-center font-bold mt-5 mb-7">Profile</h1>
      <div className="flex flex-col items-center gap-4">
        <input
          type="file"
          ref={fileRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            setAvatar(e.target.files[0]);
          }}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={
            avatar != currentUser.avatar ? URL.createObjectURL(avatar) : avatar
          }
          alt=""
          className="rounded-full w-24 h-24"
        />
        <input
          type="text"
          placeholder="username"
          className="border bg-white rounded-md p-3 py-2 w-1/3"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          value={username}
        />
        <input
          type="email"
          placeholder="email"
          className="border bg-white rounded-md p-3 py-2 w-1/3"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
        />
        <input
          type="password"
          placeholder="password"
          className="border bg-white rounded-md p-3 py-2 w-1/3"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
        />
        <button
          disabled={loading}
          onClick={handleUpdate}
          className="uppercase p-3 bg-slate-700 text-white py-2 w-1/3 rounded-md"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <NavLink
          to={"/create-listing"}
          className="uppercase p-3 bg-green-700 text-center text-white py-2 w-1/3 rounded-md"
        >
          Create Listing
        </NavLink>
        <div className="flex items-center justify-between w-1/3 text-sm text-red-600 font-semibold">
          <button onClick={deleteUser}>Delete Account</button>
          <button onClick={logOut}>Log Out</button>
        </div>

        {error && <p className="text-red-500 font-semibold w-1/3">{error}</p>}
        {success && (
          <p className="text-green-700 font-semibold w-1/3">
            Profile updated successfully!
          </p>
        )}
        <button
          onClick={handleShowListings}
          className="text-green-700 font-bold"
        >
          Show Listings
        </button>
        {listing.length > 0 ? (
          <h1 className="text-xl font-bold">Your Listings</h1>
        ) : (
          showListings && (
            <h1 className="text-xl font-bold">You do not have any Listing</h1>
          )
        )}

        {listingError && (
          <p className="text-red-600 font-semibold">{listingError}</p>
        )}

        {listing.length > 0 &&
          showListings &&
          listing.map((item) => {
            return (
              <NavLink
                to={`/listing/${item._id}`}
                className="bg-white p-3 pr-5 rounded-lg w-1/3 flex items-center justify-between"
                key={item._id}
              >
                <div className="flex items-center gap-5">
                  <img src={item.images[0]} alt="" className="w-20 h-16" />
                  <h2 className="px-5">{item.title}</h2>
                </div>
                <div className="flex flex-col">
                  <button
                    onClick={(e) => handleDeleteListing(e, item._id)}
                    className="text-red-600 font-semibold"
                  >
                    Delete
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/update-listing/${item._id}`);
                    }}
                    className="text-green-700 font-semibold"
                  >
                    Edit
                  </button>
                </div>
              </NavLink>
            );
          })}

        {deleteListings && <p className="text-red-600 font-semibold">Listing deleted succesfully!</p>}
      </div>
    </div>
  );
};

export default Profile;
