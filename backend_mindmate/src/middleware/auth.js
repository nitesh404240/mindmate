import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/UserModel/usermodel.js";
import { Order } from "../models/OrderModel/ordermodel.js";

export const verifyJWT = async (req, res, next) => {

  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decoded._id).select("-Password -refreshToken");

  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }

  req.user = {
    _id: user._id,
    role: user.role,
    email: user.Email
  };

  next();
};

export const allowRoles = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden: insufficient permissions");
    }

    next();
  };
};

export const verifyOrderAccess = async (req, res, next) => {

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const isAdmin = req.user.role === "admin";

  const isBuyer = order.userId.toString() === req.user._id.toString();

  const isSeller = order.products.some(
    p => p.sellerId.toString() === req.user._id.toString()
  );

  if (isAdmin || isBuyer || isSeller) {
    return next();
  }

  throw new ApiError(403, "Forbidden: You cannot access this order");
};
export const verifyOwnership = (Model, ownerField = "sellerId") => {
  return async (req, res, next) => {

    const item = await Model.findById(req.params.id);

    if (!item) {
      throw new ApiError(404, "Resource not found");
    }

    const isOwner =
      item[ownerField]?.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new ApiError(403, "Forbidden: You don't own this resource");
    }

    next();
  };
};