import React, { useEffect, useState } from "react";
import axios from "../Utils/Axios";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [regularPrice, setRegularPrice] = useState(0);
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [address, setAddress] = useState("");
  const [furnished, setFurnished] = useState(false);
  const [parking, setParking] = useState(false);
  const [type, setType] = useState("sell");
  const [offer, setOffer] = useState(false);
  const [description, setDescription] = useState("");
  const [created, setCreated] = useState(false);

  if (images.length > 10) {
    dispatch(updateUserFailure("At most 10 images are allowed"));
    setImages([]);
    return null;
  }

  const handleChange = (setter, value) => {
    setter(value);
  };

  const handleSubmit = () => {
    setLoading(true);
    const data = new FormData();
    data.append("title", title);
    data.append("regularPrice", regularPrice);
    data.append("bedrooms", bedrooms);
    data.append("bathrooms", bathrooms);
    data.append("discountedPrice", discountedPrice);
    data.append("address", address);
    data.append("furnished", furnished);
    data.append("parking", parking);
    data.append("type", type);
    data.append("offer", offer);
    data.append("description", description);
    for (let i = 0; i < images.length; i++) {
      data.append("images", images[i]);
    }
    
    axios
      .post("/listings/create", data)
      .then((res) => {
        setError(null);
        setLoading(false);
        setCreated(true);
      })
      .catch((error) => {
        setError(error.response.data.message);
        setLoading(false);
        setCreated(false);
      })
      .finally(() => {
        setImages([]);
        setDescription("");
        setAddress("");
        setFurnished(false);
        setParking(false);
        setType("sell");
        setOffer(false);
        setTitle("");
        setRegularPrice(0);
        setBedrooms(1);
        setBathrooms(1);
        setDiscountedPrice(0);
      });
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center my-5">Create a Listing</h1>
      <div className="py-4 flex gap-10 justify-center">
        <div className="flex flex-col gap-5 w-1/3">
          <input
            className="rounded-lg p-3"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => handleChange(setTitle, e.target.value)}
          />
          <textarea
            className="rounded-lg p-3"
            placeholder="Description"
            rows="3"
            value={description}
            onChange={(e) => handleChange(setDescription, e.target.value)}
          />
          <input
            className="rounded-lg p-3"
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => handleChange(setAddress, e.target.value)}
          />
          <div className="flex items-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                className="h-4 w-4"
                type="checkbox"
                id="sell"
                checked={type === "sell"}
                onChange={(e) =>
                  handleChange(setType, e.target.checked ? "sell" : "rent")
                }
              />
              <label htmlFor="sell">Sell</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="h-4 w-4"
                type="checkbox"
                id="rent"
                checked={type === "rent"}
                onChange={(e) =>
                  handleChange(setType, e.target.checked ? "rent" : "sell")
                }
              />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="h-4 w-4"
                type="checkbox"
                id="parking"
                value={parking}
                onChange={(e) => handleChange(setParking, e.target.checked)}
              />
              <label htmlFor="parking">Parking Spot</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="h-4 w-4"
                type="checkbox"
                id="furnished"
                value={furnished}
                onChange={(e) => handleChange(setFurnished, e.target.checked)}
              />
              <label htmlFor="furnished">Furnished</label>
            </div>
            <div className="flex items-center gap-2 -mt-5">
              <input
                className="h-4 w-4"
                type="checkbox"
                id="offer"
                value={offer}
                onChange={(e) => handleChange(setOffer, e.target.checked)}
              />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>
          <div className="flex items-center gap-7">
            <div className="flex gap-2 items-center">
              <input
                className="rounded-lg p-2 w-16"
                type="number"
                value={bedrooms}
                onChange={(e) => handleChange(setBedrooms, e.target.value)}
              />
              <span>Bedrooms</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                className="rounded-lg p-2 w-16"
                type="number"
                value={bathrooms}
                onChange={(e) => handleChange(setBathrooms, e.target.value)}
              />
              <span>Bathrooms</span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <input
              className="rounded-lg p-2 w-28"
              type="number"
              value={regularPrice}
              onChange={(e) => handleChange(setRegularPrice, e.target.value)}
            />
            <span>Regular Price</span>
          </div>
          <div className="flex gap-2 items-center">
            <input
              className="rounded-lg p-2 w-28"
              type="number"
              value={discountedPrice}
              onChange={(e) => handleChange(setDiscountedPrice, e.target.value)}
            />
            <span>Discounted Price</span>
          </div>
        </div>
        <div className="w-1/3 flex flex-col gap-4">
          {created && <p className="text-green-700 font-semibold">Listing created successfully!</p>}
          <p className="text-sm">
            <span className="font-bold">Images: </span> The first image will be
            the cover image (max10)
          </p>
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            multiple
            className="hidden"
            onChange={(e) => {
              const selectedFiles = Array.from(e.target.files);
              setImages((prev) => [...prev, ...selectedFiles]);
            }}
          />
          <div className="border bg-white p-3 rounded-lg flex gap-5 items-center">
            <label
              htmlFor="fileInput"
              className="bg-zinc-400 p-1 px-2 rounded-md cursor-pointer"
            >
              Choose Image
            </label>
            <span>{images.length} images selected</span>
          </div>
          {error && (
            <p className="text-sm text-red-500 px-2 font-semibold">{error}! </p>
          )}
          {images.map((image, index) => (
            <div
              key={index}
              className="flex justify-between px-5 py-2 rounded-lg bg-zinc-200"
            >
              <img
                src={URL.createObjectURL(image)}
                alt="Image"
                className="w-20 h-12 rounded-lg"
              />
              <button
                className="text-red-500 font-semibold"
                onClick={() => {
                  const updatedImages = images.filter((_, i) => i !== index);
                  setImages(updatedImages);
                }}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            disabled={loading}
            className="p-3 bg-slate-700 uppercase text-white rounded-lg"
            onClick={handleSubmit}
          >
            {loading ? "Loading..." : "Create Listing"}
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateListing;
