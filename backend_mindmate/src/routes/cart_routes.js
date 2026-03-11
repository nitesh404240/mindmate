import express from "express";
import {
 addToCart,
 getCart,
 removeFromCart,
 updateCartQuantity,
 clearCart
} from "../controllers/CartController.js";

import { verifyJWT } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", verifyJWT, addToCart);
router.get("/", verifyJWT, getCart);
router.delete("/:productId", verifyJWT, removeFromCart);
router.put("/update", verifyJWT, updateCartQuantity);
router.delete("/clear", verifyJWT, clearCart);

export default router;