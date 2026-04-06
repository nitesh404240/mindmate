import { asynchandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { APIResponse } from "../utils/ApiResponse.js";

import { Cart } from "../models/CartModel/cartmodel.js";
import { Order } from "../models/OrderModel/ordermodel.js";
import { Product } from "../models/ProductModel/productmodel.js";

import razorpayInstance from "../utils/Razorpayconfig.js";

/* ---------------- CREATE ORDER ---------------- */

export const createOrder = asynchandler(async (req, res) => {
  console.log("this is start");
  const userId = req.user._id;
  const { address, paymentMethod } = req.body;
console.log("this is user id", userId)
  if (!address) {
    throw new ApiError(400, "Address is required");
  }

  const cart = await Cart.findOne({ userId }).populate("items.productId");
console.log("this is cart",cart);
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  let totalAmount = 0;

  const products = cart.items.map((item) => {
    const product = item.productId;

    if (product.stock < item.quantity) {
      throw new ApiError(400, `${product.title} is out of stock`);
    }

    totalAmount += product.price * item.quantity;

    return {
      productId: product._id,
      sellerId: product.sellerId,
      quantity: item.quantity,
      priceAtPurchase: product.price,
    };
  });

  const order = await Order.create({
    userId,
    products,
    totalAmount,
    address,
    paymentMethod,
    paymentStatus: paymentMethod === "cod" ? "confirmed_cod" : "pending",
    orderStatus: "processing",
  });
  console.log("this is order",order);
  /* ---------------- COD ORDER ---------------- */

  if (paymentMethod === "cod") {
    return res.status(201).json(
      new APIResponse(201, "Order placed with Cash on Delivery", {
        mongoOrderId: order._id,
      })
    );
  }

  /* ---------------- DEV MODE (NO RAZORPAY KEYS) ---------------- */
if (!razorpayInstance) {
  return res.status(201).json({
    success: true,
    data: {
      keyId: "mock_key",
      mongoOrderId: order._id,
      amount: totalAmount * 100,
      razorpayOrderId: `mock_${order._id}`,
    },
  });
}

  /* ---------------- REAL RAZORPAY ---------------- */

  let razorpayOrder;

  try {
    razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `order_${order._id}`,
    });

    console.log("Razorpay Order Created:", razorpayOrder);
  } catch (error) {
    console.error("Razorpay Error:", error);
    throw new ApiError(500, "Failed to create Razorpay order");
  }

  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  return res.status(201).json(
    new APIResponse(201, "Order created successfully", {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      keyId: process.env.RAZORPAY_KEY_ID,
      mongoOrderId: order._id,
    })
  );
});

/* ---------------- GET USER ORDERS ---------------- */

export const getUserOrders = asynchandler(async (req, res) => {
 // console.log("wlknfwlkflkwefwekfmwekfmwemflkwemflkwemf")
  const userId = req.user._id;
  // console.log(userId)
  const orders = await Order.find({ userId })
    .populate("products.productId")
    .sort({ createdAt: -1 });
 // console.log(orders)
  return res
    .status(200)
    .json(new APIResponse(200, "User orders fetched successfully", { orders }));
});

/* ---------------- GET ORDER BY ID ---------------- */

export const getOrderById = asynchandler(async (req, res) => {
  const orderId = req.params.id;
 console.log(orderId)
  const order = await Order.findOne({
    _id: orderId,
    userId: req.user._id,
  }).populate("products.productId");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new APIResponse(200, "Order fetched successfully", { order }));
});

/* ---------------- CANCEL ORDER ---------------- */

export const cancelOrder = asynchandler(async (req, res) => {
  const orderId = req.params.id;

  const order = await Order.findOne({
    _id: orderId,
    userId: req.user._id,
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.orderStatus !== "pending") {
    throw new ApiError(400, "Order cannot be cancelled");
  }

  order.orderStatus = "cancelled";

  await order.save();

  return res
    .status(200)
    .json(new APIResponse(200, "Order cancelled successfully", { order }));
});

/* ---------------- SELLER / ADMIN ORDERS ---------------- */

export const getAllOrders = asynchandler(async (req, res) => {
  const { role, _id: userId } = req.user;

  if (role === "seller") {
    const orders = await Order.find({
      "products.sellerId": userId,
    })
      .populate("products.productId")
      .sort({ createdAt: -1 })
      .lean();

    const filteredOrders = orders.map((order) => {
      const sellerProducts = order.products.filter(
        (p) => p.sellerId.toString() === userId.toString(),
      );

      const subsellertotal = sellerProducts.reduce(
        (sum, item) => sum + item.priceAtPurchase * item.quantity,
        0,
      );

      return {
        ...order,
        products: sellerProducts,
        subsellertotal,
      };
    });

    return res
      .status(200)
      .json(
        new APIResponse(200, "Seller orders fetched successfully", {
          orders: filteredOrders,
        }),
      );
  }

  if (role === "admin") {
    const orders = await Order.find()
      .populate("products.productId")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(
        new APIResponse(200, "All orders fetched successfully", { orders }),
      );
  }
});

/* ---------------- UPDATE ORDER STATUS ---------------- */

export const updateOrderStatus = asynchandler(async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.orderStatus = status;

  await order.save();

  return res
    .status(200)
    .json(new APIResponse(200, "Order status updated successfully", { order }));
});

/* ---------------- DELETE ORDER ---------------- */

export const deleteOrder = asynchandler(async (req, res) => {
  const orderId = req.params.id;

  const order = await Order.findByIdAndDelete(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new APIResponse(200, "Order deleted successfully"));
});
