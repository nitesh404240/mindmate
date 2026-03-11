import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        sellerId : {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },

        priceAtPurchase: {
          type: Number, // To freeze price even if product price changes later
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "confirmed_cod"],
      default: "pending",
    },

    razorpayOrderId: {
      type: String, // Razorpay/Stripe transaction ID
      default: "",
    },
    paymentMethod: {
      type: String,
      enum: ["razorpay"],
     default: "razorpay",
    },
    razorpayPaymentId: {
      type: String,
      default: "",
    },
    razorpaySignature: {    
      type: String,
      default: "",
    },
    paymentProcessedAt: {
      type: Date,
    },  
    orderStatus: {
      type: String,
      enum: ["processing", "completed", "cancelled"],
      default: "processing",
    },
    address :{
       type : String,
        required : true 
    }
  },
  { timestamps: true },
  {expireAfterSeconds: 60 * 60 * 24 } // 24 hours 
);

export const Order = mongoose.model("Order", OrderSchema);