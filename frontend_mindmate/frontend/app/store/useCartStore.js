import { create } from "zustand";
import { axiosinstance } from "../lib/axios";
export const useCartStore = create((set, get) => ({

  cart: null,
  items: [],
  totalAmount: 0,
  isLoading: false,

  fetchCart: async () => {

    try {

      set({ isLoading: true });

      const res = await axiosinstance.get("/cart/");

      const cart = res.data.data;

      set({
        cart,
        items: cart?.items || [],
        totalAmount: calculateTotal(cart?.items || []),
        isLoading: false
      });

    } catch (error) {

      console.error("Fetch cart error:", error);
      set({ isLoading: false });

    }

  },

  addToCart: async (productId, quantity = 1) => {

    try {

      set({ isLoading: true });

      await axiosinstance.post("/cart/add", {
        productId,
        quantity
      });

      await get().fetchCart();
     
    } catch (error) {

      console.error("Add to cart error:", error);

    }

  },

 
  removeFromCart: async (productId) => {

    try {

      set({ isLoading: true });

      await axiosinstance.delete(`/cart/${productId}`);

      await get().fetchCart();

    } catch (error) {

      console.error("Remove item error:", error);

    }

  },


  updateQuantity: async (productId, quantity) => {

    try {

      set({ isLoading: true });

      await axiosinstance.put("/cart/update", {
        productId,
        quantity
      });

      await get().fetchCart();

    } catch (error) {

      console.error("Update quantity error:", error);

    }

  },


  clearCart: async () => {

    try {

      set({ isLoading: true });

      await axios.delete("/api/cart/clear");

      set({
        cart: null,
        items: [],
        totalAmount: 0,
        loading: false
      });

    } catch (error) {

      console.error("Clear cart error:", error);

    }

  }

}));



function calculateTotal(items) {

  if (!items || items.length === 0) return 0;

  return items.reduce((total, item) => {

    const price = item.productId?.price || item.price;

    return total + price * item.quantity;

  }, 0);

}