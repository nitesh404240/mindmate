"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {useAuthStore} from "@/app/store/useAuthStore"
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    password: "",
    Avatar: null, // avatar stored here
  });

  const { signup, isSigningUp ,Signupmessage} = useAuthStore();
const router = useRouter()
  const validateForm = () => {
    if (!formData.Username.trim()) return alert("Username is required");
    if (!formData.Email.trim()) return alert("Email is required");

    if (!/\S+@\S+\.\S+/.test(formData.Email))
      return alert("Invalid email format");

    if (!formData.password) return alert("Password is required");
    if (formData.password.length < 6)
      return alert("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();
    if (!success) return;
    console.log(formData)
    
    signup(formData);
   
  };

  useEffect(()=>{
     console.log(Signupmessage)

       if(Signupmessage) if(Signupmessage){
    router.push("/auth/Login")
   }
  },[Signupmessage])
{ /* const handleAvatar = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };*/}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 p-4">
      <div className="bg-white/20 backdrop-blur-md shadow-xl rounded-2xl p-10 w-full max-w-md border border-white/30">
        <h2 className="text-center text-4xl font-bold text-white mb-8">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username */}
          <input
            name="Username"
            type="text"
            placeholder="Username..."
            className="p-3 rounded-lg bg-white/80 border border-gray-200 focus:outline-none text-black"
            value={formData.Username}
            onChange={(e) =>
              setFormData({ ...formData, Username: e.target.value })
            }
          />

          {/* Email */}
          <input
            name="Email"
            type="email"
            placeholder="email..."
            className="p-3 rounded-lg bg-white/80 border border-gray-200 focus:outline-none text-black"
            value={formData.Email}
            onChange={(e) =>
              setFormData({ ...formData, Email: e.target.value })
            }
          />

          {/* Password */}
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="password"
            className="p-3 rounded-lg bg-white/80 border border-gray-200 focus:outline-none text-black"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          {/* Avatar Upload */}
       {/*   <div className="bg-white/80 p-3 rounded-lg border border-gray-200">
            <label className="text-gray-700 font-medium">Avatar (optional)</label>
            <input
              type="file"
              accept="image/*"
              className="mt-2 text-black border-1 w-1/4 ml-5"
              onChange={handleAvatar}
            />
          </div>
*/}
          {/* Submit */}
          <button
            type="submit"
            className="bg-indigo-700 text-white p-3 rounded-lg font-semibold hover:bg-indigo-800 transition"
            disabled={isSigningUp}
          >
            {isSigningUp ? <Loader2 className="size-5 animate-spin" /> : "Create Account"}
          </button>
        </form>

        <p className="text-center text-white mt-4">
          Already have an account?{" "}
          <Link href="/auth/Login" className="font-semibold underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
