import Listing from "../Models/listing.model.js";
import User from "../Models/user.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../Utils/cloudinary.js";
import { errorHandler } from "../Utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const {
      title,
      description,
      regularPrice,
      discountedPrice,
      address,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
    } = req.body;

    if (
      [title, description, address, type].some((feild) => feild?.trim() === "")
    ) {
      return next(errorHandler(401, "All feilds are required"));
    }

    if (
      regularPrice <= 0 ||
      discountedPrice <= 0 ||
      bathrooms <= 0 ||
      bedrooms <= 0
    ) {
      return next(
        errorHandler(401, "All numeric feilds must be greater than 0")
      );
    }

    const imagesLocalPath = req.files.map((file) => file.path);

    if (imagesLocalPath.length <= 0)
      return next(errorHandler(401, "At least one image is required"));

    const imageUrls = imagesLocalPath.map(async (image) => {
      try {
        const imageCloudPath = await uploadOnCloudinary(image);
        return imageCloudPath.url;
      } catch (error) {
        next(errorHandler(401, "At least one image is required"));
      }
    });

    const images = await Promise.all(imageUrls);

    const listing = await Listing.create({
      title,
      description,
      regularPrice,
      discountedPrice,
      address,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      images,
      user: req.user.id,
    });

    const user = await User.findById(req.user.id);
    user.listings.push(listing.id);
    await user.save();

    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, "Listing not found"));
  if (listing.user.toString() !== req.user.id) {
    return next(
      errorHandler(401, "You do not have permission to delete this listing")
    );
  }
  const user = await User.findById(req.user.id);
  user.listings = user.listings.filter((id) => id.toString() !== listing.id);
  await user.save();

  try {
    await Listing.findByIdAndDelete(req.params.id);
    {
      listing.images.length > 0 &&
        listing.images.map((image) => {
          const arr = image.split("/");
          const filepath = arr[arr.length - 1].split(".")[0];
          return deleteFromCloudinary(filepath);
        });
    }
    res.status(200).json("Listing deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, "Listing not found"));
  if (listing.user.toString() !== req.user.id) {
    return next(
      errorHandler(401, "You do not have permission to update this listing")
    );
  }

  const {
    title,
    description,
    regularPrice,
    discountedPrice,
    address,
    bathrooms,
    bedrooms,
    furnished,
    parking,
    type,
    offer,
  } = req.body;

  if (
    [title, description, address, type].some((feild) => feild?.trim() === "")
  ) {
    return next(errorHandler(401, "All feilds are required"));
  }

  if (
    regularPrice <= 0 ||
    discountedPrice <= 0 ||
    bathrooms <= 0 ||
    bedrooms <= 0
  ) {
    return next(errorHandler(401, "All numeric feilds must be greater than 0"));
  }

  listing.title = title;
  listing.description = description;
  listing.regularPrice = regularPrice;
  listing.discountedPrice = discountedPrice;
  listing.address = address;
  listing.bathrooms = bathrooms;
  listing.bedrooms = bedrooms;
  listing.furnished = furnished;
  listing.parking = parking;
  listing.type = type;
  listing.offer = offer;

  const imagePaths = [...req.files.map((file) => file.path)];
  if (typeof req.body.images === "string") {
    imagePaths.push(req.body.images);
  }
  if (typeof req.body.images === "object") {
    imagePaths.push(...req.body.images);
  }

  if (imagePaths.length <= 0) {
    return next(errorHandler(401, "At least one image is required"));
  }

  const imageUrls = imagePaths.map(async (image) => {
    try {
      const imageCloudPath = await uploadOnCloudinary(image);
      return imageCloudPath.url;
    } catch (error) {
      next(errorHandler(401, "At least one image is required"));
    }
  });
  const images = await Promise.all(imageUrls);
  {
    listing.images.length > 0 &&
      listing.images.map((image) => {
        const arr = image.split("/");
        const filepath = arr[arr.length - 1].split(".")[0];
        return deleteFromCloudinary(filepath);
      });
  }
  listing.images = images;

  await listing.save();
  res.status(200).json(listing);
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found"));
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const listings = await Listing.find({
      title: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .skip(startIndex)
      .limit(limit)
      .sort({ [sort]: order });

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
