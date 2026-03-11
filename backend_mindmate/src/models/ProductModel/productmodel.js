import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      enum: ["book", "course", "notes", "ebook"],
      required: true,
    },

    product_thumbnails: {
      type: String, // URL image
      required: true,
    },
product_images: [
      {
        type: String, // URL images
      },
    ],

    rating: {
      type: Number,
      default: 0,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },

    tags: [
      {
        type: String,
      },
    ],

    stock: {
      type: Number,
      default: 100,
    },

    author: {
      type: String,

      trim: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", ProductSchema);