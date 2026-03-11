import { create } from "zustand";
import { axiosinstance } from "../lib/axios";

export const useProductStore = create((set, get) => ({
  isLoading: false,
  isCreatingProduct: false,
  selectedProduct : false,
  isUpdatingProduct: false,
  updatedProduct: null,
  createdProduct: null,
  product: [],
  pagination: null,
  error: null,

  createProduct: async (formData) => {
    set({ isCreatingProduct: true, isLoading: true });
    const res = await axiosinstance.post("/products/create", formData, {
      withCredentials: true,headers: {
          "Content-Type": "multipart/form-data",
        }
    });
    set({
      createdProduct: res?.data?.data,
      isCreatingProduct : false,
      isLoading: false,
    });
  },
  updateProduct: async (productId, formData) => {
    set({ isUpdatingProduct: null, isLoading: true });
    const res = await axiosinstance.patch(`/products/${productId}`, formData, {
      withCredentials: true,
    });
    set({
      selectedProduct: res?.data?.data,
      isLoading: false,
    });
  },
    getProductById: async (productId) => {
    set({ selectedProduct: null, isLoading: true });
    const res = await axiosinstance.get(`/products/${productId}`, {
      withCredentials: true,
    });
    set({
      selectedProduct: res?.data?.data,
      isLoading: false,
    });
  },
  deleteProduct: async (productId) => {
    const res = await axiosinstance.delete(`/products/${productId}`, {
      withCredentials: true,
    });
    return null;
  },

   getsellerproduct: async () => {
    set({isLoading: true });
    const res = await axiosinstance.get("/products/sellerproducts", {
      withCredentials: true,
    });
    console.log(res?.data?.data);
    set({
      product: res?.data?.data,
      isLoading: false,
    });
  },
  deleteProduct: async (productId) => {
    const res = await axiosinstance.delete(`/products/${productId}`, {
      withCredentials: true,
    });
    return null;
  },

  getAllProducts: async (params = {}) => {
    set({ isLoading: true });

    try {
      const query = new URLSearchParams(params).toString();

      const res = await axiosinstance.get(`/products?${query}`);

      set({
        product: res?.data?.data?.products,
        pagination: res?.data?.data?.pagination,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch products",
        isLoading: false,
      });
    }
  },
}));
