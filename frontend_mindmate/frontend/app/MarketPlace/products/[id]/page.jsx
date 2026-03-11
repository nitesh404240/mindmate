"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useProductStore } from "../../../store/useProductStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { useCartStore } from "../../../store/useCartStore";

import {
  DollarSign,
  Upload,
  Tag,
  Edit,
  Trash,
  Save,
  ShoppingCart
} from "lucide-react";

import { Spinner } from "../../../../components/ui/spinner";

export default function SellerProductPage() {

  const router = useRouter();
  const { id } = useParams();

  const {
    selectedProduct,
    getProductById,
    deleteProduct,
    updateProduct,
    isLoading
  } = useProductStore();

  const {
    addToCart,
    items,
    updateQuantity
  } = useCartStore();

  const { user } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    tags: "",
    author: ""
  });

  useEffect(() => {
    if (id) getProductById(id);
  }, [id]);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        title: selectedProduct.title,
        description: selectedProduct.description,
        price: selectedProduct.price,
        stock: selectedProduct.stock,
        author: selectedProduct.author,
        tags: selectedProduct.tags?.join(", ")
      });
    }
  }, [selectedProduct]);

  const isSeller = user?._id === selectedProduct?.sellerId;

  const cartItem = items?.find(
    (item) => item.productId?._id === selectedProduct?._id
  );

  const quantity = cartItem?.quantity || 0;

  const increaseQty = async () => {
    if (quantity === 0) {
      await addToCart(selectedProduct._id, 1);
    } else {
      await updateQuantity(selectedProduct._id, quantity + 1);
    }
  };

  const decreaseQty = async () => {
    if (quantity <= 1) return;
    await updateQuantity(selectedProduct._id, quantity - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
  };

  const handleUpdate = async () => {

    const data = new FormData();

    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("author", formData.author);

    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    data.append("tags", JSON.stringify(tagsArray));

    if (image) {
      data.append("product_thumbnails", image);
    }

    await updateProduct(id, data);

    setIsEditing(false);
  };

  const handleDelete = async () => {

    const confirmDelete = confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    await deleteProduct(selectedProduct._id);

    router.push("/Dashboard/sellerproducts");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Spinner size="large" />
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Product not found
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#0d1117] text-white p-10 pt-28">

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

        {/* IMAGE CARD */}

        <div className="bg-gradient-to-b from-[#1c2333] to-[#10151f] border border-slate-800 rounded-2xl p-8 flex items-center justify-center shadow-lg">

          <img
            src={
              image
                ? URL.createObjectURL(image)
                : selectedProduct.product_thumbnails || "/placeholder.png"
            }
            className="rounded-xl max-h-[420px] object-contain"
          />

        </div>


        {/* PRODUCT DETAILS */}

        <div className="space-y-6">

          {/* TITLE */}

          {isSeller && isEditing ? (

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 bg-[#151921] border border-slate-700 rounded-lg"
            />

          ) : (

            <h1 className="text-4xl font-bold tracking-tight">
              {selectedProduct.title}
            </h1>

          )}

          {/* DESCRIPTION */}

          {isSeller && isEditing ? (

            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 bg-[#151921] border border-slate-700 rounded-lg"
            />

          ) : (

            <p className="text-slate-400">
              {selectedProduct.description}
            </p>

          )}

          {/* PRICE */}

          <div className="flex items-center gap-2 text-3xl text-emerald-400 font-semibold">

            <DollarSign size={26} />
            {selectedProduct.price}

          </div>

          {/* META INFO */}

          <div className="space-y-2 text-slate-300">

            <p>Stock: {selectedProduct.stock}</p>
            <p>Author: {selectedProduct.author}</p>

          </div>

          {/* TAGS */}

          <div className="flex flex-wrap gap-2">

            {selectedProduct.tags?.map((tag, index) => (

              <span
                key={index}
                className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-lg text-sm flex items-center gap-1"
              >
                <Tag size={14} />
                {tag}
              </span>

            ))}

          </div>


          {/* CART OR SELLER ACTIONS */}

          <div className="pt-6">

            {isSeller ? (

              <div className="flex gap-4">

                {isEditing ? (

                  <button
                    onClick={handleUpdate}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-5 py-2 rounded-lg"
                  >
                    <Save size={16} />
                    Save
                  </button>

                ) : (

                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-lg"
                  >
                    <Edit size={16} />
                    Edit
                  </button>

                )}

                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-5 py-2 rounded-lg"
                >
                  <Trash size={16} />
                  Delete
                </button>

              </div>

            ) : (

              <div className="flex items-center gap-4">

                {<div className="flex items-center gap-4 pt-6">

  {quantity === 0 ? (

    <button
      onClick={increaseQty}
      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-xl font-semibold shadow-lg"
    >
      <ShoppingCart size={18} />
      Add to Cart
    </button>

  ) : (

    <>
      {/* Quantity Controls */}

      <div className="flex items-center gap-4 bg-[#151921] border border-slate-700 rounded-xl px-4 py-2">

        <button
          onClick={decreaseQty}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700"
        >
          -
        </button>

        <span className="text-lg font-semibold w-6 text-center">
          {quantity}
        </span>

        <button
          onClick={increaseQty}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700"
        >
          +
        </button>

      </div>

      {/* VIEW CART BUTTON */}

      <button
        onClick={() => router.push("/MarketPlace/CartAction/view")}
        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold"
      >
        View Cart
      </button>

    </>

  )}

</div>}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );
}