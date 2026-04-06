"use client";

import { useAuthStore } from "@/app/store/useAuthStore";
import { useCartStore } from "@/app/store/useCartStore";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { ShoppingCart } from "lucide-react";

import ProfileDropdown from "@/components/ProfileDropdown"
export default function Navbar() {

const [open, setOpen] = useState(false);

const { authUser, logout, checkAuth } = useAuthStore();
const { items, fetchCart } = useCartStore();

const router = useRouter();

useEffect(() => {
checkAuth();
fetchCart();
}, []);

const isAuthenticated = !!authUser;

const totalItems = items.reduce(
(sum, item) => sum + item.quantity,
0
);

const handleLogout = () => {
logout();
router.push("/");
};

return (


<nav className="fixed w-full z-50 backdrop-blur-sm bg-gradient-to-r from-indigo-900/30 via-black/30 to-indigo-900/60 border-b border-gray-700">

  <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

    {/* Logo */}

    <Link href="/Dashboard" className="flex items-center gap-3">

      <img
        src="https://res.cloudinary.com/dygicfl33/image/upload/v1772905230/pwecshn5z6dqriiqiipg.png"
        className="h-10 w-10 rounded-full border-2 border-indigo-400"
      />

      <h1 className="text-2xl font-bold text-indigo-400">
        Mindmate
      </h1>

    </Link>


    {/* Desktop Links */}

    <div className="hidden md:flex gap-8 text-gray-200 text-lg">

      <Link href="/Dashboard">Dashboard</Link>
      <Link href="/notes">Notes</Link>
      <Link href="/MarketPlace/AllProduct">Store</Link>

      {authUser?.role === "admin" && (
        <Link href="/admin/dashboard" className="text-red-400">
          Admin
        </Link>
      )}

      {authUser?.role === "seller" && (
        <Link href="/seller/panel" className="text-green-400">
          Seller
        </Link>
      )}

    </div>


    {/* Desktop Right Section */}

    <div className="hidden md:flex items-center gap-6">

      {isAuthenticated && (

        <button
          onClick={() => router.push("/MarketPlace/CartActions/view")}
          className="relative"
        >

          <ShoppingCart size={30} color="white"/>

          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 rounded-full">
              {totalItems}
            </span>
          )}

        </button>

      )}


      {isAuthenticated ? (
        <ProfileDropdown user={authUser} />
      ) : (

        <div className="flex gap-3">

          <Link
            href="/auth/Login"
            className="px-4 py-2 border rounded-full"
          >
            Login
          </Link>

          <Link
            href="/auth/Register"
            className="px-4 py-2 bg-indigo-500 rounded-full"
          >
            Register
          </Link>

        </div>

      )}

    </div>


    {/* Mobile Menu Button */}

    <button
      className="md:hidden text-3xl"
      onClick={() => setOpen(!open)}
    >
      ☰
    </button>

  </div>


  {/* Mobile Menu */}

  {open && (

    <div className="md:hidden px-6 py-4 space-y-4 bg-[#111]">

      <Link href="/Dashboard">Dashboard</Link>
      <Link href="/notes">Notes</Link>
      <Link href="/MarketPlace/AllProduct">Store</Link>

      {isAuthenticated && (

        <button
          onClick={() => router.push("/MarketPlace/CartActions/view")}
          className="flex items-center gap-2"
        >
          <ShoppingCart size={20} />
          Cart ({totalItems})
        </button>

      )}

      {isAuthenticated && (

        <div className="border-t pt-4 space-y-3">

          <p className="font-semibold">
            {authUser?.Username}
          </p>

          <button
            onClick={() => router.push("/Profile")}
            className="block"
          >
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="text-red-400"
          >
            Logout
          </button>

        </div>

      )}

    </div>

  )}

</nav>


);
}
