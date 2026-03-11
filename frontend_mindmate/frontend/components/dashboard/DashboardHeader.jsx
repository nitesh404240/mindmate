// components/dashboard/DashboardHeader.jsx
"use client";
import { useAuthStore } from '@/app/store/useAuthStore';

export default function DashboardHeader() {
    const {authUser,isLoggingIn} = useAuthStore();
    let  username = "******"
    if(!isLoggingIn){
        username = authUser?.Username;
    }
    
    return (
        <div className="mb-6">
            <h1 className="text-4xl font-extrabold text-white">Welcome Back, {username}!</h1>
            <p className="text-indigo-400 mt-1">Your MindSpace is ready.</p>
        </div>
    );
}
