import { useLocation } from "react-router-dom";
import axios from "../Utils/Axios";
import React, { useEffect, useState } from "react";
import ListingItem from "./ListingItem";
import { useSelector } from "react-redux";

const Search = () => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    } else {
      setSearchTerm("");
    }
    const searchQuery = urlParams.toString();
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
    <div>
      <h1 className="text-center text-3xl font-bold my-5">Listing Results</h1>
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
