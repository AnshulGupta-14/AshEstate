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
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();

    axios
      .get(`/listings/get?${searchQuery}`)
      .then((res) => {
        const temp = res.data.filter(
          (listing) => listing.user !== currentUser?._id
        );
        if (temp.length < 9) {
          setShowMore(false);
        }
        setListings([...listings, ...temp]);
      })
      .catch((err) => setError(err.response.data.message));
  };

  useEffect(() => {
    setLoading(true);
    setShowMore(false);
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    } else {
      setSearchTerm("");
    }
    const searchQuery = urlParams.toString();
    if (searchQuery.split("=")[1] === "") {
      navigate("/");
    }

    axios
      .get(`/listings/get?${searchQuery}`)
      .then((res) => {
        const temp = res.data.filter(
          (listing) => listing.user !== currentUser?._id
        );
        setListings(temp);
        setShowMore(temp.length >= 9);
      })
      .catch((err) => setError(err.response.data.message))
      .finally(() => setLoading(false));
  }, [location.search]);

  return (
    <div className="p-7 px-[6%] flex flex-col gap-5">
      <div className="flex gap-[35%] items-center">
        <NavLink
          to={`/filter?${location.search}`}
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
      {listings.length === 0 && !loading && !error && (
        <p className="text-center text-3xl font-bold my-5">
          No listings found.
        </p>
      )}

      <div className="flex gap-7 flex-wrap">
        {listings.map((listing) => (
          <ListingItem key={listing._id} listing={listing} />
        ))}
      </div>

      {showMore && (
        <button
          className="text-green-700 hover:underline p-7 text-center w-full"
          onClick={onShowMoreClick}
        >
          Show more
        </button>
      )}
    </div>
  );
};

export default Search;
