import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "../Utils/Axios";
import React, { useEffect, useState } from "react";
import ListingItem from "./ListingItem";
import { useSelector } from "react-redux";

const Search = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  let searchQuery = new URLSearchParams(location.search).toString();

  useEffect(() => {
    setLoading(true);
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    } else {
      setSearchTerm("");
    }
    searchQuery = urlParams.toString();
    if (searchQuery.split("=")[1] === "") {
      navigate("/");
    }

    axios
      .get(`/listings/get?${searchQuery}`)
      .then((res) => setListings(res.data))
      .catch((err) => setError(err.response.data.message))
      .finally(() => setLoading(false));
  }, [location.search]);

  const showListings = listings.filter(
    (listing) => listing.user !== currentUser?._id
  );

  return (
    <div className="p-7 flex flex-col gap-5">
      <div className="flex gap-[35%] items-center">
        <NavLink
          to={`/filter?${searchQuery}`}
          state={{ searchTerm }}
          className="bg-slate-800 text-white h-1/2 p-1 px-3 rounded-lg"
        >
          Filter
        </NavLink>
        <h1 className="text-3xl font-bold">Listing Results</h1>
      </div>
      {loading && (
        <p className="text-center text-3xl font-bold my-5">Loading...</p>
      )}
      {error && <p className="text-red-700">{error}</p>}
      {showListings.length === 0 && !loading && !error && (
        <p className="text-center text-3xl font-bold my-5">
          No listings found.
        </p>
      )}

      {showListings.map((listing) => (
        <ListingItem key={listing._id} listing={listing} />
      ))}
    </div>
  );
};

export default Search;
