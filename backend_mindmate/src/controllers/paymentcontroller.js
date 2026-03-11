import crypto from "crypto";
import { asynchandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { APIResponse } from "../utils/ApiResponse.js";
import {Order} from "../models/OrderModel/ordermodel.js";
import { Product } from "../models/ProductModel/productmodel.js";


const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// Verify Razorpay Payment Signature
export const verifyRazorpayPayment = asynchandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, "Missing required payment details");
  }
    // Generate expected signature  
    const generated_signature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');       

    if (generated_signature === razorpay_signature) {
      
      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
      if (!order) {
        throw new ApiError(404, "Order not found");
      } 
        if (order.paymentStatus === 'paid') {
        return res.status(200).json(new APIResponse(200, "Order already paid and fulfilled.", { orderId: order._id }));
    }
        order.paymentStatus = 'paid';
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        order.paymentProcessedAt = new Date();
        await order.save();

        //stock reduce
        for (const item of order.products) {
          const product = await Product.findById(item.productId);
          if (product) {
            product.stock -= item.quantity;
            await product.save();
          } 
        }

        return res.status(200).json(new APIResponse(200, "Payment verified and order updated successfully", { orderId: order._id }));
    }   else{
      // Invalid signature, possible tampering
      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
      await Order.findByIdAndUpdate(order._id, { 
            paymentStatus: "failed",
            razorpayPaymentId: razorpay_payment_id, // Save the failed payment ID for investigation
            razorpaySignature: razorpay_signature,
        });  
    }   
})
export default {verifyRazorpayPayment}
  //   amount: totalAmount * 100, // amount in the smallest currency unit
  //   currency: "INR",