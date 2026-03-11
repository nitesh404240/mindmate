"use client";

import { useState } from "react";
import { Sparkles, FileText, ListChecks, Lightbulb, Send, Loader2, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotesStore } from "../store/useNotesStore";
import { axiosinstance } from "../lib/axios";
export default function AIPage() {
  const router = useRouter();
  const { notes } = useNotesStore();
  
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [activeTool, setActiveTool] = useState(null);

  const tools = [
    { id: 'summary', name: 'Summarize', icon: <FileText size={20} />, prompt: 'Summarize this note  points.' },
    { id: 'tasks', name: 'Extract Tasks', icon: <ListChecks size={20} />, prompt: 'Identify all actionable tasks or to-dos from this note.' },
    { id: 'insights', name: 'Get Insights', icon: <Lightbulb size={20} />, prompt: 'Provide unique insights or connections found in this content.' },
  ];

  const handleMagic = async (tool) => {
    if (!selectedNoteId) return alert("Please select a note first!");
    
    const note = notes.find(n => n._id === selectedNoteId);
    setActiveTool(tool.id);4
    setLoading(true);
    setAiResult("");
   const formdata = {
     content : note.content,
     prompt : tool.prompt,
   }
   console.log(formdata)
    try {
      
      const response = await axiosinstance.post("/notes/ai/summarize",formdata,{withCredentials:true});
    const result = response.data.data;
     
      console.log("this is the ai data " ,response.data.data);
      setAiResult(result);
    } catch (error) {
      setAiResult("Oops! The AI got tired. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-white pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
          <ChevronLeft size={20} /> Back to Dashboard
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
            <Sparkles className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-bold">AI Assistant</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* LEFT: Note Selection */}
          <div className="md:col-span-1 space-y-4">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Step 1: Pick a Note</label>
            <select 
              value={selectedNoteId}
              onChange={(e) => setSelectedNoteId(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Select a note...</option>
              {notes.map(note => (
                <option key={note._id} value={note._id}>{note.title || "Untitled Note"}</option>
              ))}
            </select>

            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest block pt-4">Step 2: Choose Magic</label>
            <div className="space-y-2">
              {tools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => handleMagic(tool)}
                  disabled={loading}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    activeTool === tool.id ? 'bg-indigo-600 border-indigo-400' : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {tool.icon}
                  <span className="font-semibold">{tool.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: AI Output */}
          <div className="md:col-span-2">
            <div className="bg-gray-800/30 border border-gray-700 rounded-3xl min-h-[400px] p-8 relative overflow-hidden">
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/50 backdrop-blur-sm">
                  <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
                  <p className="text-indigo-300 font-medium animate-pulse">Consulting the AI...</p>
                </div>
              ) : aiResult ? (
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-xl font-bold text-indigo-400 mb-4 flex items-center gap-2">
                    <Sparkles size={18} /> Result
                  </h3>
                  <div className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {aiResult}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <Send size={48} className="mb-4" />
                  <p>Select a note and a tool to generate insights.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}