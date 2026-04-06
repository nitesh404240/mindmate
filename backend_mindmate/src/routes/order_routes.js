import { Router } from "express";
import { verifyJWT, allowRoles, verifyOrderAccess } from "../middleware/auth.js";

import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} from "../controllers/ordercontroller.js";

import { mockPayment, verifyRazorpayPayment } from "../controllers/paymentcontroller.js";

const router = Router();

router.post("/verify-payment", verifyRazorpayPayment);
router.post("/verify-mock-payment", mockPayment);
router.post("/create", verifyJWT, createOrder);

router.get("/my-orders", verifyJWT, getUserOrders);

router.get("/:id", verifyJWT, verifyOrderAccess, getOrderById);

router.patch("/cancel/:id", verifyJWT, verifyOrderAccess, cancelOrder);

router.get("/", verifyJWT, allowRoles("seller","admin"), getAllOrders);

router.patch("/update-status/:id", verifyJWT, allowRoles("seller","admin"), updateOrderStatus);

router.delete("/delete/:id", verifyJWT, allowRoles("admin"), deleteOrder);

export default router;