"use client";

import { useEffect } from "react";
import { useProductStore } from "../../store/useProductStore";
import ProductCard from "../../../components/productcard/productcard";
import { Spinner } from "../../../components/ui/spinner";
import { useRouter } from "next/navigation";
export default function ProductsPage() {
  const { product, getsellerproduct, getAllProducts, isLoading, pagination } =
    useProductStore();
   const router = useRouter();
  useEffect(() => {
    getsellerproduct({ page: 1 });
  }, []);
  console.log(product);
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
        {/* Header */}

        <div className="mb-8 flex items-center justify-between pl-10 pr-10">
          <div>
            <h1 className="text-3xl font-bold">Explore Products</h1>

            <p className="text-slate-400 text-sm">
              Browse digital resources created by sellers
            </p>
          </div>

          <button
            type="submit"
            onClick={() => router.push("/Dashboard")}
            className="flex m-5 border-b-2 cursor-pointer text-white underline-2 text-2xl"
          >
            Dashboard
          </button>
        </div>

        {/* Product Grid */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {product?.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>

        {/* Pagination */}

        {pagination && (
          <div className="flex justify-center mt-10 gap-4">
            {Array.from({ length: pagination.totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => getAllProducts({ page: i + 1 })}
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
