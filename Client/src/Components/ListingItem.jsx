import React from "react";
import { NavLink } from "react-router-dom";

const ListingItem = ({ listing }) => {
  return (
    <div className="bg-white w-[20vw] rounded-lg overflow-hidden shadow-md hover:shadow-2xl trasition-shadow">
      <NavLink to={`/listing/${listing._id}`}>
        <img
          src={listing.images[0]}
          alt=""
          className="h-[25vh] w-full object-cover hover:scale-105"
        />
        <div className="px-3 flex flex-col gap-2 py-3">
          <h2 className="truncate text-xl">{listing.title}</h2>
          <div className="flex -my-1">
            <i className="ri-map-pin-line text-green-700"></i>
            <p className="truncate text-sm text-gray-600">{listing.address}</p>
          </div>
          <p className="line-clamp-2 text-sm text-gray-600 leading-none">
            {listing.description}
          </p>
          <div className="flex gap-4 leading-none mt-2">
            <p className="text-slate-600 font-bold">
              {listing.discountedPrice.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </p>
            {listing.discountedPrice !== listing.regularPrice && (
              <del className="opacity-60">
                {listing.regularPrice.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </del>
            )}
          </div>
          <p className="flex gap-5 text-xs font-bold leading-none">
            <span>
              {listing.bedrooms} {listing.bedrooms > 1 ? "beds" : "bed"}
            </span>{" "}
            <span>
              {listing.bathrooms} {listing.bedrooms > 1 ? "baths" : "bath"}
            </span>
          </p>
        </div>
      </NavLink>
    </div>
  );
};

export default ListingItem;
