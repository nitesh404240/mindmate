import { create } from "zustand";
import { axiosinstance } from "../lib/axios";
import { toast } from "react-hot-toast"; // ✅ FIXED IMPORT
import { Link } from "lucide-react";

export const useAuthStore = create((set, get) => ({
  authUser: null,

  // Loading states
  isSigningUp: false,
  Signupmessage : null,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isChangingPassword: false,
  isCheckingAuth: false,

  // Login errors
  loginEmailError: "",
  loginPasswordError: "",

  setLoginEmailError: (message) => set({ loginEmailError: message }),
  setLoginPasswordError: (message) => set({ loginPasswordError: message }),

  clearLoginErrors: () =>
    set({ loginEmailError: "", loginPasswordError: "" }),

  // ----------------------------
  // CHECK AUTH
  // ----------------------------
  checkAuth: async () => {
    set({ isCheckingAuth: true })
   
    try {
      const res = await axiosinstance.get("/users/check", {
        withCredentials: true,
      });
      //console.log(res.data)
      set({ authUser: res.data.data });
    } catch (error) {
      console.log("Auth Check Failed:", error.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ----------------------------
  // SIGNUP
  // ----------------------------
  signup: async (formData) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosinstance.post("/users/register", formData, {
        withCredentials: true,
      });
     console.log(res.data)
      set({ Signupmessage: res.data.success});
      

      toast.success("Account created successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ----------------------------
  // LOGIN
  // ----------------------------
  login: async (data) => {
    set({ isLoggingIn: true });

    // Clear previous errors
    get().clearLoginErrors();

    try {
      const res = await axiosinstance.post("/users/login", data, {
        withCredentials: true,
      });
      
      set({ authUser: res.data.message });
    //   if (res.data.success) {
    //   router.push("/dashboard");  // ⭐ redirect
    // }
      toast.success("Logged in successfully");
    } catch (error) {
      const message =
        error?.response?.data?.message?.toLowerCase() || "login failed";

      // Email errors
      if (message.includes("email")) {
        get().setLoginEmailError("Email does not exist");
      }
      // Password errors
      if (message.includes("password")) {
        get().setLoginPasswordError("Incorrect password");
      }

      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ----------------------------
  // LOGOUT
  // ----------------------------
  logout: async () => {
    try {
      await axiosinstance.post(
        "/users/logout",
        {},
        { withCredentials: true }
      );

      set({ authUser: null });

      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  },
}));
