import { asynchandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { APIResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/ProductModel/productmodel.js";
import { Order } from "../models/OrderModel/ordermodel.js";
import razorpayInstance from "../utils/Razorpayconfig.js";
//import products from "razorpay/dist/types/products.js";
// Create new order (Only logged-in users)
import { Cart } from "../models/CartModel/cartmodel.js";

export const createOrder = asynchandler(async (req, res) => {

 const userId = req.user._id;

 const cart = await Cart.findOne({ userId }).populate("items.productId");

 if (!cart || cart.items.length === 0) {
  throw new ApiError(400, "Cart is empty");
 }

 let totalAmount = 0;

 const products = cart.items.map(item => {

  const product = item.productId;

  if (product.stock < item.quantity) {
   throw new ApiError(400, `${product.title} is out of stock`);
  }

  totalAmount += product.price * item.quantity;

  return {
   productId: product._id,
   quantity: item.quantity,
   priceAtPurchase: product.price,
   sellerId: product.sellerId
  };

 });

 const order = await Order.create({
  userId,
  products,
  totalAmount,
  paymentMethod: "razorpay",
  paymentStatus: "pending"
 });

 const razorpayOrder = await razorpayInstance.orders.create({
  amount: totalAmount * 100,
  currency: "INR",
  receipt: `order_${order._id}`
 });

 order.razorpayOrderId = razorpayOrder.id;
 await order.save();

 return res.status(201).json(
  new APIResponse(201, "Order created", {
   orderId: razorpayOrder.id,
   amount: razorpayOrder.amount,
   keyId: process.env.RAZORPAY_KEY_ID,
   mongoOrderId: order._id
  })
 );

});
export const getUserOrders = asynchandler(async (req, res) => {
  const userId = req.user._id;  
  const orders = await Order.find({ userId }).populate("products.productId").sort({ createdAt: -1 });

  return res.status(200).json(  
    new APIResponse(200, "User orders fetched successfully", { orders })
  );
}
);

export const getOrderById = asynchandler(async (req, res) => {
  const orderId = req.params.id;  
  const order = await Order.findOne({
  _id: orderId,
  userId: req.user._id
}).populate("products.productId");

if (!order) {
    throw new ApiError(404, "Order not found");
  }
  return res.status(200).json(  
    new APIResponse(200, "Order fetched successfully", { order })
  );
});


export const cancelOrder = asynchandler(async (req, res) => {
  const orderId = req.params.id;  
  const order = await Order.findOne({
  _id: orderId,
  userId: req.user._id
});
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  if (order.paymentStatus === "paid") {
    throw new ApiError(400, "Cannot cancel a paid order");
  }
  order.paymentStatus = "cancelled";
  await order.save();
  return res.status(200).json(  
    new APIResponse(200, "Order cancelled successfully", { order })
  );
});

export const getAllOrders = asynchandler(async (req, res) => {
  const {role , _id : userId} = req.user;
  console.log(role,userId);
   //const order = await Order.find({userId});
  if(role === "seller"){
  const orders = await Order.find({ "products.sellerId": userId })
  .populate("products.productId")
  .sort({ createdAt: -1 })
  .lean();
 //console.log(orders);
  if (orders.length == 0) {
    throw new ApiError(404, "No orders found for this seller");
  }
// Convert mongoose docs → plain JS objects
const plainOrders = orders;
// Filter products for this seller ONLY
plainOrders.forEach(order => {
    order.products = order.products.filter(
        p => p.sellerId.toString() === userId.toString()
    );
});

const subsellertotal = (products) => {
    return products.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0);
};

// Add subtotal field to each order
plainOrders.forEach(order => {
    order.subsellertotal = subsellertotal(order.products);
}); 
// Return corrected list
return res.status(200).json(
    new APIResponse(200, "Seller orders fetched successfully", { orders: plainOrders },subsellertotal)
);

  }else if(role === "admin"){
  const orders = await Order.find().populate("products.productId").sort({ createdAt: -1 }); 
  if (!orders) {
    throw new ApiError(404, "No orders found");
  } 
  return res.status(200).json(  
    new APIResponse(200, "All orders fetched successfully", { orders })
  );
}
});

export const updateOrderStatus = asynchandler(async (req, res) => {
  const orderId = req.params.id;  
  const { status } = req.body;  
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  order.orderStatus = status;
  await order.save();
  return res.status(200).json(  
    new APIResponse(200, "Order status updated successfully", { order })
  );
});

export const deleteOrder = asynchandler(async (req, res) => {
  const orderId = req.params.id;  
  const order = await Order.findByIdAndDelete(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  } 
  return res.status(200).json(
    new APIResponse(200, "Order deleted successfully", {})
  );
});
export default { createOrder , getUserOrders, getOrderById , cancelOrder};
