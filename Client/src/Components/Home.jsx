import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import axios from "../Utils/Axios";
import ListingItem from "./ListingItem";

const Home = () => {
  SwiperCore.use([Navigation]);
  const images = [
    "https://plus.unsplash.com/premium_photo-1661954372617-15780178eb2e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bHV4dXJ5JTIwaG91c2V8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bHV4dXJ5JTIwaG91c2V8ZW58MHx8MHx8fDA%3D",
    "https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bHV4dXJ5JTIwaG91c2V8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1558240894-9821078a16a9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGx1eHVyeSUyMGhvdXNlfGVufDB8fDB8fHww",
  ];
  const [saleListing, setSaleListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);

  const fetchSaleListing = () => {
    axios
      .get("/listings/get?type=sale&limit=4")
      .then((res) => setSaleListing(res.data))
      .catch((err) => console.log(err));
  };

  const fetchRentListing = () => {
    axios
      .get("/listings/get?type=rent&limit=4")
      .then((res) => setRentListing(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchSaleListing();
    fetchRentListing();
  }, []);

  console.log(saleListing, rentListing);

  return (
    <div className="flex flex-col gap-16 py-7">
      <div className="flex flex-col gap-6 p-[7%] px-3 max-w-6xl mx-auto">
        <h1 className="text-6xl text-slate-700 font-bold">
          Find your next <span className="text-slate-500">perfect</span> <br />{" "}
          place with ease
        </h1>
        <div className="text-sm text-gray-500">
          <p>
            Ash Estate will help you find your home fast, easy and comfortable.
          </p>
          <p>Out expert support are always available.</p>
        </div>
        <NavLink className="text-blue-800 font-bold hover:underline text-sm">
          Let's get started...
        </NavLink>
      </div>

      <div>
        <Swiper navigation>
          {images.map((item, index) => (
            <SwiperSlide key={item}>
              <img
                src={item}
                alt={`Slide ${index + 1}`}
                className="obbject-cover h-[75vh] w-full"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="px-[6%] flex flex-col gap-3">
        <h1 className="text-2xl font-semibold text-slate-600">Recent places for sale</h1>
        <div className="flex flex-wrap gap-7">
          {saleListing &&
            saleListing.map((sale, index) => <ListingItem listing={sale} />)}
        </div>
        <NavLink to={`search?type=sale`} className='text-blue-800 text-sm font-semibold hover:underline'>Show more places for sale</NavLink>
      </div>

      <div className="px-[6%] flex flex-col gap-3">
        <h1 className="text-2xl font-semibold text-slate-600">Recent places for rent</h1>
        <div className="flex flex-wrap gap-7">
          {rentListing &&
            rentListing.map((rent, index) => <ListingItem listing={rent} />)}
        </div>
        <NavLink to={`search?type=rent`} className='text-blue-800 text-sm font-semibold hover:underline'>Show more places for rent</NavLink>
      </div>
    </div>
  );
};

export default Home;
