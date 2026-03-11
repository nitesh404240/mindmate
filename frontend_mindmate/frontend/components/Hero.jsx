"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Hero() {
  const {authUser} = useAuthStore()
const router = useRouter();
useEffect(() => {
    if (authUser) ;
  }, [authUser]);
   let isAuthenticated = false;
if(authUser){
  isAuthenticated = true;
}
  return (
    <div className="relative min-h-[250vh] w-full overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-700 text-white">

      {/* Floating blurred circles */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-400/40 rounded-full blur-3xl"></div>

      {/* Content centered in 2.5 height */}
      <div className="flex flex-col items-center justify-center h-screen text-center px-6">

        {/* Small badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/20"
        >
          <Sparkles className="text-yellow-300" size={18} />
          <p className="text-sm font-medium">Welcome to Our Platform</p>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-5xl sm:text-7xl font-extrabold mt-6 leading-tight drop-shadow-lg"
        >
          Build Your Future <br />
          With <span className="text-yellow-300">Confidence</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-lg sm:text-2xl mt-6 max-w-2xl text-white/80"
        >
          Experience a platform designed to empower creators, learners, and innovators.  
          Build smarter. Grow faster. Achieve more.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="flex gap-4 mt-10"
        >
          {(isAuthenticated) ? (<a
            href="/Dashboard"
            className="px-8 py-3 bg-yellow-400 text-black font-semibold rounded-xl shadow-lg hover:bg-yellow-300 transition"
          >
            Get Started
          </a>):(
            <a
            href="/auth/Login"
            className="px-8 py-3 bg-white/20 border border-white/30 rounded-xl backdrop-blur-md font-medium hover:bg-white/30 transition flex items-center gap-2"
          >
            Learn More <ArrowRight size={18} />
          </a>
          )}
          
<a
            href="/auth/Register"
            className="px-8 py-3 bg-yellow-400 text-black font-semibold rounded-xl shadow-lg hover:bg-yellow-300 transition"
          >
            create account
          </a>
          

          <div>
            
          </div>

          
        </motion.div>
      </div>

      {/* Lower highlight section inside the 2.5 view height */}
      <div className="h-[150vh] w-full flex items-center justify-center px-6">
        <div className="bg-white/10 p-10 rounded-3xl max-w-5xl backdrop-blur-md border border-white/20 shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Why Choose Us?</h2>
          <p className="text-white/80 text-lg max-w-3xl">
            Our platform delivers world-class tools that help you achieve
            unmatched results. Whether you're building apps, studying, or running
            a business — we provide everything you need to succeed.
          </p>
        </div>
      </div>

    </div>
  );
}
