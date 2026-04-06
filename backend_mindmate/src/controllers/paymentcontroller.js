import crypto from "crypto";
import { asynchandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { APIResponse } from "../utils/ApiResponse.js";

import { Order } from "../models/OrderModel/ordermodel.js";
import { Product } from "../models/ProductModel/productmodel.js";
import { Cart } from "../models/CartModel/cartmodel.js";

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export const verifyRazorpayPayment = asynchandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, "Missing required payment details");
  }

  /* ---------------- VERIFY SIGNATURE ---------------- */

  const generated_signature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated_signature !== razorpay_signature) {
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

    if (order) {
      order.paymentStatus = "failed";
      order.razorpayPaymentId = razorpay_payment_id;
      order.razorpaySignature = razorpay_signature;

      await order.save();
    }

    throw new ApiError(400, "Payment verification failed");
  }

  /* ---------------- FIND ORDER ---------------- */

  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  /* ---------------- PREVENT DOUBLE PAYMENT ---------------- */

  if (order.paymentStatus === "paid") {
    return res
      .status(200)
      .json(new APIResponse(200, "Order already paid", { orderId: order._id }));
  }

  /* ---------------- UPDATE ORDER ---------------- */

  order.paymentStatus = "paid";
  order.orderStatus = "confirmed";
  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;
  order.paymentProcessedAt = new Date();

  await order.save();

  /* ---------------- REDUCE STOCK ---------------- */

  for (const item of order.products) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity },
    });
  }

  /* ---------------- CLEAR CART ---------------- */

  await Cart.findOneAndUpdate(
    { userId: order.userId },
    { $set: { items: [] } },
  );

  /* ---------------- RESPONSE ---------------- */

  return res.status(200).json(
    new APIResponse(200, "Payment verified successfully", {
      orderId: order._id,
    }),
  );
});

export const mockPayment = asynchandler(async (req, res) => {

  const { mongoOrderId } = req.body;

  const order = await Order.findById(mongoOrderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.paymentStatus = "paid";
  order.orderStatus = "completed";
order.razorpayPaymentId = "this is a mock payment";
  order.razorpaySignature = "this is mock payment";
  order.paymentProcessedAt = new Date();
  await order.save();

  for (const item of order.products) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity }
    });
  }

  await Cart.findOneAndUpdate(
    { userId: order.userId },
    { $set: { items: [] } }
  );

  return res.status(200).json(
    new APIResponse(200, "Mock payment successful")
  );

});
