"use client";

import { useAuthStore } from "@/app/store/useAuthStore";
import { useCartStore } from "@/app/store/useCartStore";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { ShoppingCart } from "lucide-react";

export default function Navbar() {

  const [open, setOpen] = useState(false);

  const { authUser, logout, checkAuth } = useAuthStore();
  const { items } = useCartStore();

  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const isAuthenticated = !!authUser;

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/");
  };

  const CartButton = () => (
    <button
      onClick={() => router.push("/cart")}
      className="relative flex items-center text-white hover:text-indigo-300 transition"
    >
      <ShoppingCart size={24} />

      {totalItems > 0 && (
        <span className="absolute -top-2 -right-3 bg-red-500 text-xs px-2 py-0.5 rounded-full">
          {totalItems}
        </span>
      )}
    </button>
  );

  const AuthButtons = () => {

    if (isAuthenticated) {
      return (
        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium transition-all shadow-lg"
        >
          Logout
        </button>
      );
    }

    return (
      <div className="flex gap-3">

        <Link
          href="/auth/Login"
          className="px-4 py-2 rounded-full border border-gray-300 text-gray-100 hover:bg-gray-700 transition-all"
        >
          Login
        </Link>

        <Link
          href="/auth/Register"
          className="px-4 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-all shadow-md"
        >
          Get Started
        </Link>

      </div>
    );

  };

  return (

    <nav className="fixed w-full z-50 backdrop-blur-sm bg-gradient-to-r from-indigo-900/30 via-black/30 to-indigo-900/30 border-b border-gray-700">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

        {/* Logo */}

        <Link href="/Dashboard" className="flex items-center gap-3">

          <img
            src="https://res.cloudinary.com/dygicfl33/image/upload/v1772905230/pwecshn5z6dqriiqiipg.png"
            alt="Mindmate"
            className="h-10 w-10 rounded-full border-2 border-indigo-400"
          />

          <h1 className="text-2xl font-bold text-indigo-400 tracking-wide">
            Mindmate
          </h1>

        </Link>


        {/* Desktop Menu */}

        <div className="hidden md:flex gap-8 text-gray-200 text-lg">

          <Link href="/Dashboard" className="hover:text-indigo-300 transition-colors">
            Dashboard
          </Link>

          <Link href="/notes" className="hover:text-indigo-300 transition-colors">
            Notes
          </Link>

          <Link href="/MarketPlace/AllProduct" className="hover:text-indigo-300 transition-colors">
            Store
          </Link>

          {authUser?.role === "admin" && (
            <Link href="/admin/dashboard" className="hover:text-red-400 transition-colors">
              Admin
            </Link>
          )}

          {authUser?.role === "seller" && (
            <Link href="/seller/panel" className="hover:text-green-400 transition-colors">
              Seller
            </Link>
          )}

        </div>


        {/* Right Side (Cart + Auth Buttons) */}

        <div className="hidden md:flex items-center gap-6">

          {isAuthenticated && <button
              onClick={() => router.push("/MarketPlace/CartActions/view")}
              className="flex items-center gap-2 text-white"
            >
              <ShoppingCart size={20} />
              Cart ({totalItems})
            </button>}

          <AuthButtons />

        </div>


        {/* Mobile Menu Button */}

        <button
          className="md:hidden text-gray-200 text-3xl hover:text-indigo-300 transition-colors"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

      </div>


      {/* Mobile Menu */}

      {open && (

        <div className="md:hidden bg-gradient-to-b from-indigo-900/50 to-black/50 backdrop-blur-sm border-t border-gray-700 px-6 py-4 space-y-4 text-gray-200">

          <Link href="/Dashboard" onClick={() => setOpen(false)} className="block hover:text-indigo-300">
            Dashboard
          </Link>

          <Link href="/notes" onClick={() => setOpen(false)} className="block hover:text-indigo-300">
            Notes
          </Link>

          <Link href="/MarketPlace/AllProduct" onClick={() => setOpen(false)} className="block hover:text-indigo-300">
            Store
          </Link>

          {authUser?.role === "admin" && (
            <Link href="/admin/dashboard" className="hover:text-red-400">
              Admin
            </Link>
          )}

          {authUser?.role === "seller" && (
            <Link href="/seller/panel" className="hover:text-green-400">
              Seller
            </Link>
          )}

          {isAuthenticated && (
            <button
              onClick={() => router.push("/MarketPlace/CartActions/view")}
              className="flex items-center gap-2"
            >
              <ShoppingCart size={20} />
              Cart ({totalItems})
            </button>
          )}

          <div className="pt-4 border-t border-gray-600 space-y-2">

            {isAuthenticated ? (

              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 text-red-400 hover:text-red-500"
              >
                Logout
              </button>

            ) : (

              <>
                <Link href="/auth/Login" className="block py-2 hover:text-indigo-300">
                  Login
                </Link>

                <Link href="/auth/Register" className="block py-2 hover:text-indigo-300">
                  Get Started
                </Link>
              </>

            )}

          </div>

        </div>

      )}

    </nav>

  );

}