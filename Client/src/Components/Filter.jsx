import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Filter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchTerm = location.state.searchTerm;

  const [data, setData] = useState({
    type: "all",
    parking: false,
    furnished: false,
    sort: "created_at",
    order: "desc",
  });

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "sale" ||
      e.target.id === "rent"
    ) {
      setData({ ...data, type: e.target.id });
    }

    if (e.target.id === "parking" || e.target.id === "furnished") {
      setData({ ...data, [e.target.id]: e.target.checked });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "created_at";
      setData({ ...data, sort, order });
    }
  };

  const handleSubmit = (e) => {
    const searchParams = new URLSearchParams({
      searchTerm,
      type: data.type,
      parking: data.parking,
      furnished: data.furnished,
      sort: data.sort,
      order: data.order,
    });
    const searchQuery = searchParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    setData({
      type: urlParams.get("type") || "all",
      parking: urlParams.get("parking") === "true",
      furnished: urlParams.get("furnished") === "true",
      sort: urlParams.get("sort") || "created_At",
      order: urlParams.get("order") || "desc",
    });
  },[location.search])

  return (
    <div className="p-7">
      <div className="w-[30%] flex flex-col gap-7 mx-auto bg-white p-5 rounded-lg">
        <h1 className="text-2xl font-semibold">Filters:</h1>
        <div className="flex items-center gap-2">
          <h1 className="font-semibold">Type: </h1>
          <input
            type="checkbox"
            id="all"
            className="h-7 w-4"
            onChange={handleChange}
            checked={data.type === "all"}
          />
          <label htmlFor="all">All</label>
          <input
            type="checkbox"
            id="sale"
            className="h-7 w-4"
            onChange={handleChange}
            checked={data.type === "sale"}
          />
          <label htmlFor="sale">Sale</label>
          <input
            type="checkbox"
            id="rent"
            className="h-7 w-4"
            onChange={handleChange}
            checked={data.type === "rent"}
          />
          <label htmlFor="rent">Rent</label>
        </div>
        <div className="flex items-center gap-2">
          <h1 className="font-semibold">Amenities: </h1>
          <input
            type="checkbox"
            id="parking"
            className="h-7 w-4"
            onChange={handleChange}
            checked={data.parking}
          />
          <label htmlFor="parking">Parking</label>
          <input
            type="checkbox"
            id="furnished"
            className="h-7 w-4"
            onChange={handleChange}
            checked={data.furnished}
          />
          <label htmlFor="furnished">Furnished</label>
        </div>
        <div className="flex gap-4 items-center">
          <h1 className="font-semibold">Sort:</h1>
          <select
            id="sort_order"
            className="p-2 rounded-lg border"
            onChange={handleChange}
            defaultValue={"createdAt_desc"}
          >
            <option value="createdAt_desc">Latest</option>
            <option value="createdAt_asc">Oldest</option>
            <option value="regularPrice_desc">Price high to low</option>
            <option value="regularPrice_asc">Price low to high</option>
          </select>
        </div>
        <button
          onClick={handleSubmit}
          className="uppercase bg-slate-800 text-white p-2 rounded-lg"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Filter;
