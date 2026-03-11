"use client";
import { Mic, Edit, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function CreateNoteCard() {
    // Accessing authUser safely to avoid 'undefined' errors
    const authState = useAuthStore();
    const authUser = authState?.authUser || authState?.user; 
    const router = useRouter();

    const handleCreateNote = (mode) => {
        // Direct check for truthy user object
        const path = authUser 
            ? `/notes/new?mode=${mode}` 
            : `/notes/new?mode=${mode}&guest=true`;
        router.push(path);
    };

    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-5 shadow-xl border border-white/10 group">
            {/* Subtle glow effect to save vertical space vs a large icon */}
            <div className="absolute -right-4 -top-4 bg-white/10 p-10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex p-3 bg-white/15 rounded-xl backdrop-blur-md border border-white/20">
                        <Mic size={22} className="text-white animate-pulse" />
                    </div>
                    
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-black text-white tracking-tight leading-none">
                                Speak Your Mind
                            </h2>
                            <Sparkles size={14} className="text-indigo-200" />
                        </div>
                        <p className="text-xs text-indigo-100/70 font-medium mt-1">
                            AI transcription for instant idea capture.
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handleCreateNote('voice')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-indigo-600 text-xs font-bold rounded-xl hover:bg-indigo-50 transition-all active:scale-95 shadow-lg"
                    >
                        <Mic size={14} /> Voice Input
                    </button>
                    
                    <button 
                        onClick={() => handleCreateNote('text')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white text-xs font-bold rounded-xl hover:bg-white/20 transition-all active:scale-95"
                    >
                        <Edit size={14} /> Type Note
                    </button>
                </div>
            </div>
        </div>
    );
}