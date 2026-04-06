"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
LogOut,
User,
BookOpen,
ShoppingCart,
Package,
LayoutDashboard
} from "lucide-react";

import { axiosinstance } from "@/app/lib/axios";

export default function ProfileDropdown({ user }) {

const [open, setOpen] = useState(false);
const router = useRouter();

const handleLogout = async () => {
await axiosinstance.post("/users/logout");
router.push("/login");
};

const MenuItem = ({ icon: Icon, label, path }) => (
<button
onClick={() => {
router.push(path);
setOpen(false);
}}
className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-slate-700 transition"
> <Icon size={18} />
{label} </button>
);

return ( <div className="relative">


  {/* Avatar Button */}

  <button
    onClick={() => setOpen(!open)}
    className="w-10 h-10 rounded-full overflow-hidden border border-indigo-400 hover:scale-105 transition"
  >
    <img
      src={user?.Avatar || "/avatar.png"}
      className="w-full h-full object-cover"
    />
  </button>


  {/* Dropdown */}

  {open && (

    <div className="absolute right-0 mt-3 w-72 bg-[#151921] border border-slate-700 rounded-xl shadow-xl">

      {/* User Info */}

      <div className="p-4 border-b border-slate-700">

        <div className="flex items-center gap-3">

          <img
            src={user?.Avatar || "/avatar.png"}
            className="w-12 h-12 rounded-full object-cover"
          />

          <div>
            <p className="font-semibold text-white">
              {user?.Username}
            </p>

            <p className="text-sm text-gray-400">
              {user?.Email}
            </p>
          </div>

        </div>

      </div>


      {/* Navigation */}

      <div className="p-3 space-y-1 text-gray-200">

        <MenuItem
          icon={LayoutDashboard}
          label="Dashboard"
          path="/Dashboard"
        />

        <MenuItem
          icon={BookOpen}
          label="My Notes"
          path="/notes"
        />

        <MenuItem
          icon={Package}
          label="My Orders"
          path="/MarketPlace/orders"
        />

        <MenuItem
          icon={ShoppingCart}
          label="Cart"
          path="/MarketPlace/CartActions/view"
        />

        <MenuItem
          icon={User}
          label="Profile Settings"
          path="/profile"
        />

      </div>


      {/* Logout */}

      <div className="border-t border-slate-700 p-3">

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-400 hover:text-red-500 w-full px-3 py-2 rounded-lg hover:bg-slate-700 transition"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </div>

  )}

</div>


);
}
