import { create } from "zustand";
import { axiosinstance } from "../lib/axios";

export const useOrderStore = create((set) => ({
  isLoading: false,
  createdOrder: null,

  createOrder: async (data) => {
    try {
      set({ isLoading: true });

      const res = await axiosinstance.post("/orders/create", data, {
        withCredentials: true,
      });

      const orderData = res?.data?.data;

      set({
        createdOrder: orderData,
        isLoading: false,
      });

      return orderData;
    } catch (error) {
      set({ isLoading: false });

      console.error("Create order error:", error);

      throw error;
    }
  },
}));
