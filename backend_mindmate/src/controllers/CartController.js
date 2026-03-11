import { asynchandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { APIResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/CartModel/cartmodel.js";
import { Product } from "../models/ProductModel/productmodel.js";


export const addToCart = asynchandler(async (req, res) => {

  const userId = req.user._id;
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.stock < quantity) {
    throw new ApiError(400, "Not enough stock available");
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: []
    });
  }

  const existingItem = cart.items.find(
    item => item.productId.toString() === productId
  );

  if (existingItem) {

    existingItem.quantity += quantity;

  } else {

    cart.items.push({
      productId,
      quantity,
      price: product.price,
      sellerId: product.sellerId
    });

  }

  await cart.save();

  return res.status(200).json(
    new APIResponse(200, "Product added to cart", cart)
  );

});




export const getCart = asynchandler(async (req, res) => {

  const userId = req.user._id;

  const cart = await Cart.findOne({ userId })
    .populate("items.productId");

  if (!cart) {

    return res.status(200).json(
      new APIResponse(200, "Cart is empty", { items: [] })
    );

  }

  return res.status(200).json(
    new APIResponse(200, "Cart fetched successfully", cart)
  );

});


/*
-------------------------------------
Remove Product From Cart
-------------------------------------
*/

export const removeFromCart = asynchandler(async (req, res) => {

  const userId = req.user._id;
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.items = cart.items.filter(
    item => item.productId.toString() !== productId
  );

  await cart.save();

  return res.status(200).json(
    new APIResponse(200, "Item removed from cart", cart)
  );

});


/*
-------------------------------------
Update Cart Quantity
-------------------------------------
*/

export const updateCartQuantity = asynchandler(async (req, res) => {

  const userId = req.user._id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    throw new ApiError(400, "Product ID and quantity required");
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const item = cart.items.find(
    item => item.productId.toString() === productId
  );

  if (!item) {
    throw new ApiError(404, "Item not found in cart");
  }

  item.quantity = quantity;

  await cart.save();

  return res.status(200).json(
    new APIResponse(200, "Cart updated successfully", cart)
  );

});


/*
-------------------------------------
Clear Cart (after successful order)
-------------------------------------
*/

export const clearCart = asynchandler(async (req, res) => {

  const userId = req.user._id;

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.items = [];

  await cart.save();

  return res.status(200).json(
    new APIResponse(200, "Cart cleared successfully", cart)
  );

});


export default {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
  clearCart
};