import React, { useEffect, useState } from "react";
import axios from "../Utils/Axios";
import { useParams } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { useSelector } from "react-redux";
import Contact from "./Contact";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const { id } = useParams();

  const currentUser = useSelector((state) => state.user);
  const [listing, setListing] = useState(null);
  const [contact, setContact] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/listings/get/${id}`)
      .then((res) => {
        setListing(res.data);
        setLoading(false);
        setError("");
      })
      .catch((err) => {
        setError(err.response.data.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {error && <h1>{error}</h1>}
      {loading && <h1>Loading...</h1>}
      {listing && (
        <>
          <Swiper navigation>
            {listing.images.map((item, index) => (
              <SwiperSlide key={item}>
                <img
                  src={item}
                  alt={`Slide ${index + 1}`}
                  className="obbject-cover h-[50vh] w-full"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="w-[60%] mx-auto flex flex-col py-5 gap-5">
            <h1 className="text-2xl font-semibold leading-none">
              {listing.discountedPrice.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}{" "}
              {listing.discountedPrice !== listing.regularPrice && (
                <del className="opacity-60">
                  {listing.regularPrice.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </del>
              )}
            </h1>
            <h1 className="text-lg leading-none font-semibold">
              {listing.title}
            </h1>
            <i className="ri-map-pin-line flex gap-3 items-center">
              {listing.address}
            </i>
            <p className="py-1 bg-red-900 w-1/5 text-white text-center capitalize rounded-lg">
              For {listing.type}
            </p>
            <p className=""><span className="font-bold">Description</span> - {listing.description}</p>
            <div className="flex items-center gap-10 text-green-900 font-semibold">
              <i className="ri-hotel-bed-line flex gap-2">
                {listing.bedrooms} bed{listing.bedrooms > 1 && "s"}
              </i>
              <i className="ri-showers-line flex gap-2">
                {listing.bathrooms} bath{listing.bathrooms > 1 && "s"}
              </i>
              <i className="ri-parking-fill flex gap-1">
                {listing.parking ? "Parking" : "No Parking"}
              </i>
              <i className="ri-sofa-fill flex gap-2">
                {listing.furnished ? "Furnished" : "No Furniture"}
              </i>
            </div>
            {currentUser &&
              currentUser.currentUser._id !== listing.user &&
              !contact && (
                <button
                  onClick={() => setContact(true)}
                  className="w-full p-3 bg-slate-800 text-white rounded-lg mt-5"
                >
                  Contact Landlord
                </button>
              )}

            {contact && <Contact listing={listing} />}
          </div>
        </>
      )}
    </div>
  );
};

export default Listing;
