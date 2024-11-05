import Listing from "../Models/listing.model.js";
import User from "../Models/user.model.js";
import { uploadOnCloudinary } from "../Utils/cloudinary.js";
import { errorHandler } from "../Utils/error.js";
import bcrypt from "bcrypt";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(
      errorHandler(401, "You do not have permission to update this user")
    );

  try {
    let { username, email, password } = req.body;
    if (password) password = bcrypt.hashSync(password, 10);

    const avatarLocalPath = req.file?.path;
    console.log(req.files);

    const avatar = avatarLocalPath
      ? await uploadOnCloudinary(avatarLocalPath)
      : null;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username,
          email,
          password,
          avatar: avatar?.url,
        },
      },
      { new: true }
    );

    const { userPassword, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(
      errorHandler(401, "You do not have permission to delete this user")
    );
  try {
    await User.findByIdAndDelete(req.user.id);
    res
      .status(200)
      .clearCookie("access_token")
      .json("User deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  const users = await User.findById(req.user.id);
  if (req.user.id !== req.params.id) {
    return next(
      errorHandler(
        401,
        "You do not have permission to view this user's listings"
      )
    );
  }

  const listings = users.listings?.map((item) => {
    return Listing.findById(item);
  });
  const listingData = await Promise.all(listings);

  res.status(200).json(listingData);
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404,"User not found!"));
    const { userPassword,...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
