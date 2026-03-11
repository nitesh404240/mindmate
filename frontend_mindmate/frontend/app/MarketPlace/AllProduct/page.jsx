"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "../../store/useProductStore";
import ProductCard from "../../../components/productcard/productcard";
import { Spinner } from "../../../components/ui/spinner";
import { Search } from "lucide-react";

export default function ProductsPage() {

  const { product, getAllProducts, isLoading, pagination } = useProductStore();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    getAllProducts({ page: 1 });
  }, []);

  const handleSearch = () => {
    getAllProducts({
      page: 1,
      search,
      category,
      minPrice,
      maxPrice,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");

    getAllProducts({ page: 1 });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Spinner size="large" />
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#0d1117] text-white p-10 pt-30">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Explore Products</h1>
          <p className="text-slate-400 text-sm">
            Browse digital resources created by sellers
          </p>
        </div>

        {/* FILTER BAR */}
        <div className="bg-[#151921] border border-slate-800 rounded-xl p-6 mb-10 flex flex-col md:flex-row gap-4">

          {/* Search */}
          <div className="flex items-center bg-[#0d1117] border border-slate-700 rounded-lg px-3 flex-1">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search by title..."
              className="bg-transparent outline-none px-2 py-2 w-full text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category */}
          <input
            type="text"
            placeholder="Category"
            className="bg-[#0d1117] border border-slate-700 rounded-lg px-3 py-2 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          {/* Price Min */}
          <input
            type="number"
            placeholder="Min Price"
            className="bg-[#0d1117] border border-slate-700 rounded-lg px-3 py-2 text-sm w-32"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />

          {/* Price Max */}
          <input
            type="number"
            placeholder="Max Price"
            className="bg-[#0d1117] border border-slate-700 rounded-lg px-3 py-2 text-sm w-32"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg text-sm font-semibold"
          >
            Search
          </button>

          {/* Clear */}
          <button
            onClick={clearFilters}
            className="bg-slate-800 hover:bg-slate-700 px-6 py-2 rounded-lg text-sm"
          >
            Clear
          </button>

        </div>


        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {product?.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
            />
          ))}

        </div>


        {/* PAGINATION */}
        {pagination && (

          <div className="flex justify-center mt-10 gap-4">

            {Array.from({ length: pagination.totalPages }).map((_, i) => (

              <button
                key={i}
                onClick={() =>
                  getAllProducts({
                    page: i + 1,
                    search,
                    category,
                    minPrice,
                    maxPrice,
                  })
                }
                className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-indigo-600"
              >
                {i + 1}
              </button>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}