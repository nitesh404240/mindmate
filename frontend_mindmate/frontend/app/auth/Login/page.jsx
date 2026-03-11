"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/app/store/useAuthStore";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/Dashboard';
  const [formData, setformData] = useState({
    Email: "",
    password: "",
  });

  const { login, isLoggingIn, loginEmailError, loginPasswordError,authUser ,checkauth} =
    useAuthStore();
    
  const validateForm = () => {
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
    if (success === true) login(formData);
  };
const router = useRouter();
useEffect(() => {
  
    if (authUser) router.push(decodeURIComponent(returnUrl));
  }, [authUser]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 p-4">
      <div className="bg-white/20 backdrop-blur-md shadow-xl rounded-2xl p-10 w-full max-w-md border border-white/30">

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
          <p className="text-white/80 mt-1">Login to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                className="w-full p-3 pl-10 rounded-lg bg-white/80 border border-gray-200 focus:outline-none text-black"
                type="email"
                placeholder="email..."
                value={formData.Email}
                onChange={(e) =>
                  setformData({ ...formData, Email: e.target.value })
                }
              />
            </div>
            {loginEmailError && (
              <p className="text-red-300 text-sm mt-1">{loginEmailError}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

              <input
                className="w-full p-3 pl-10 rounded-lg bg-white/80 border border-gray-200 focus:outline-none text-black"
                type={showPassword ? "text" : "password"}
                placeholder="password..."
                value={formData.password}
                onChange={(e) =>
                  setformData({ ...formData, password: e.target.value })
                }
              />

              {/* Show/Hide */}
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>

            {loginPasswordError && (
              <p className="text-red-300 text-sm mt-1">
                {loginPasswordError}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-indigo-700 text-white p-3 rounded-lg font-semibold hover:bg-indigo-800 transition w-full"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <Loader2 className="size-5 animate-spin mx-auto" />
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Bottom Link */}
        <p className="text-center text-white mt-4">
          Don’t have an account?{" "}
          <Link href="/auth/Register" className="font-semibold underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
