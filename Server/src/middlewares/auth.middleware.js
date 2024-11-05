import { errorHandler } from "../Utils/error.js";
import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, "Unauthorized access token"));
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err);
      
      return next(errorHandler(403, "Invalid access token"));
    }
    req.user = user;
    next();
  });
};
