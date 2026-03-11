import { Router } from "express";
import { upload } from "../middleware/multer.js";
import { verifyJWT, allowRoles, verifyOwnership } from "../middleware/auth.js";

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  getSellerProducts,
  deleteProduct
} from "../controllers/productcontroller.js";

import { Product } from "../models/ProductModel/productmodel.js";

const router = Router();

/* ---------------- Public Routes ---------------- */

// GET /products
router.get("/", getAllProducts);

// GET /products/:id
router.get("/sellerproducts", verifyJWT,getSellerProducts);

router.get("/:id", getProductById);


/* ---------------- Seller/Admin Routes ---------------- */

// POST /products
router.post(
  "/create",
  verifyJWT,
  allowRoles("seller", "admin"),
  upload.fields([
    { name: "product_thumbnails", maxCount: 1 },
    { name: "product_images", maxCount: 5 }
  ]),
  createProduct
);
console.log("yes");
router.get("/sellerproducts",verifyJWT,getSellerProducts);

// PATCH /products/:id
router.patch(
  "/:id",
  verifyJWT,
  allowRoles("seller", "admin"),
  verifyOwnership(Product, "sellerId"),
  upload.fields([
    { name: "product_thumbnails", maxCount: 1 },
    { name: "product_images", maxCount: 5 }
  ]),
  updateProduct
);

// DELETE /products/:id
router.delete(
  "/:id",
  verifyJWT,
  verifyOwnership(Product, "sellerId"),
  deleteProduct
);

export default router;