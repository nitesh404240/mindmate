"use client";

import { useState, useEffect } from "react";
import { Upload, Tag, DollarSign, Package } from "lucide-react";
import { useProductStore } from "../../store/useProductStore";
import { useRouter } from "next/navigation";
import { Spinner } from "../../../components/ui/spinner";

export default function ProductListingPage() {
  const router = useRouter();

  const { createProduct, createdProduct, isCreatingProduct } =
    useProductStore();

  const [image, setImage] = useState(null);
  const [product_image, setproductImage] = useState([]);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    tags: "",
    stock: "",
    author: "",
  });

  const handleImageSelect = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
  };
  const handleProductImageSelect = (e) => {
    const file = Array.from(e.target.files);

    if (!file) return;

    setproductImage(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) return "Product title is required";

    if (!formData.description.trim()) return "Product description is required";

    if (!formData.price) return "Product price is required";

    if (!formData.category) return "Category is required";

    if (!formData.author.trim()) return "Author is required";

    if (!image) return "thumbnail image is required";
    if (product_image.length === 0) return "Product images are required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    const data = new FormData();

    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);

    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    data.append("tags", JSON.stringify(tagsArray));

    data.append("stock", formData.stock);
    data.append("author", formData.author);

    if (image) {
      data.append("product_thumbnails", image);
    }
    if (product_image) {
      product_image.forEach((img) => {
        data.append("product_images", img);
      });
    }
    await createProduct(data);
  };

  useEffect(() => {
    if (createdProduct?._id) {
      router.push(`/MarketPlace/products/${createdProduct._id}`);
    }
  }, [createdProduct, router]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex justify-center items-start py-10 px-6">
      
      <div className="w-full max-w-3xl bg-[#151921] border border-slate-800 rounded-2xl p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Create Product</h1>
          <p className="text-slate-400 text-sm">
            Add a new product to your marketplace listing.
          </p>
          </div>
          
<button 
      type="submit"
      onClick={()=> router.push("/Dashboard")}
      className="flex m-5 border-b-2 text-white underline-2 text-2xl">
            Dashboard 
      </button>

        </div>
        

        {/* Loading overlay */}
        {isCreatingProduct && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#151921] p-8 rounded-xl flex flex-col items-center gap-4">
              <Spinner size="large" />
              <p className="text-white font-semibold">
                Creating your product...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="text-sm text-slate-400">Product Title *</label>
            <input
              required
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-[#0d1117] border border-slate-700 rounded-lg"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-slate-400">Description *</label>
            <textarea
              required
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-[#0d1117] border border-slate-700 rounded-lg"
            />
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400 flex items-center gap-1">
                <DollarSign size={16} /> Price *
              </label>
              <input
                required
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full mt-2 p-3 bg-[#0d1117] border border-slate-700 rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400 flex items-center gap-1">
                <Package size={16} /> Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full mt-2 p-3 bg-[#0d1117] border border-slate-700 rounded-lg"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm text-slate-400">Category *</label>
            <select
              required
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-[#0d1117] border border-slate-700 rounded-lg"
            >
              <option value="">Select category</option>
              <option value="notes">Notes</option>
              <option value="ebook">Ebook</option>
              <option value="course">Course</option>
              <option value="book">Book</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm text-slate-400 flex items-center gap-1">
              <Tag size={16} /> Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="example: calculus, exam notes"
              className="w-full mt-2 p-3 bg-[#0d1117] border border-slate-700 rounded-lg"
            />
          </div>

          {/* Author */}
          <div>
            <label className="text-sm text-slate-400">Author *</label>
            <input
              required
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-[#0d1117] border border-slate-700 rounded-lg"
            />
          </div>

          {/* Image Upload */}
          <div className="flex justify-evenly">
            <label className="mt-2 border border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 cursor-pointer">
              <Upload size={28} />
              <p className="text-sm mt-2">Click to upload thumbnail image *</p>

              <input
                required
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
            </label>
            <label className="mt-2 border border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 cursor-pointer">
              <Upload size={28} />
              <p className="text-sm mt-2">Click to upload product image *</p>

              <input
                required
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleProductImageSelect}
              />
            </label>
          </div>
          <div className="flex justify-items-start">
            {image && (
            <img
              src={URL.createObjectURL(image)}
              className="mt-4 w-40 rounded-lg"
            />
          )}
          <div className="flex-row gap-3 flex-wrap mt-4">
            {product_image.map((img, index) => (
              <img
                key={index}
                src={URL.createObjectURL(img)}
                className="w-24 h-24 object-cover flex gap-5 rounded-lg"
              />
            ))}
          </div>
          
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isCreatingProduct}
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isCreatingProduct ? (
              <>
                <Spinner size="small" />
                Creating Product...
              </>
            ) : (
              "Create Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
