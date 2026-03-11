"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, Search, Grid, List, 
  Calendar, Tag, MoreVertical, 
  Trash2, FileText, Pin
} from "lucide-react";
import { useNotesStore } from "../store/useNotesStore";
import { useAuthStore } from "../store/useAuthStore";

export default function NotesDashboard() {
  const router = useRouter();
  const { notes, fetchNotes, deleteNote } = useNotesStore();
  const { authUser } = useAuthStore();

  // Local UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewType, setViewType] = useState("grid"); // 'grid' or 'list'

  useEffect(() => {
    if (authUser) fetchNotes();
  }, [authUser, fetchNotes]);

  // Logic: Filter notes based on search and category
  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || note.category?.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories for filter chips
  const allCategories = ["All", ...new Set(notes.flatMap(n => n.category || []))];

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              My Notes
            </h1>
            <p className="text-gray-400 mt-1">You have {filteredNotes.length} notes</p>
          </div>
          
          <button 
            onClick={() => router.push('/notes/new')}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Plus size={20} /> Create New Note
          </button>
        </div>

        {/* --- FILTERS BAR --- */}
        <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700/50 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            <div className="flex bg-gray-900 p-1 rounded-lg border border-gray-700">
              <button 
                onClick={() => setViewType("grid")}
                className={`p-1.5 rounded-md ${viewType === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}
              >
                <Grid size={18} />
              </button>
              <button 
                onClick={() => setViewType("list")}
                className={`p-1.5 rounded-md ${viewType === 'list' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}
              >
                <List size={18} />
              </button>
            </div>
            
            <div className="h-8 w-[1px] bg-gray-700 hidden lg:block" />

            <div className="flex gap-2">
              {allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- NOTES GRID/LIST --- */}
        {filteredNotes.length > 0 ? (
          <div className={viewType === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "flex flex-col gap-4"
          }>
            {filteredNotes.map((note) => (
              <NoteCard 
                key={note._id} 
                note={note} 
                viewType={viewType}
                onDelete={() => deleteNote(note._id)}
                onClick={() => router.push(`/notes/${note._id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-gray-800/30 rounded-3xl border-2 border-dashed border-gray-700">
            <div className="bg-gray-800 p-6 rounded-full mb-4">
              <FileText size={48} className="text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white">No notes found</h3>
            <p className="text-gray-500 max-w-xs text-center mt-2">
              Try adjusting your search or create a brand new note to get started.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

/* --- REUSABLE NOTE CARD COMPONENT --- */
function NoteCard({ note, viewType, onDelete, onClick }) {
  const isGrid = viewType === 'grid';

  return (
    <div 
      onClick={onClick}
      className={`group relative bg-gray-800 border border-gray-700 rounded-2xl p-5 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all cursor-pointer flex ${isGrid ? 'flex-col' : 'flex-row items-center justify-between'}`}
    >
      <div className={isGrid ? "" : "flex-1"}>
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {note.title || "Untitled"}
          </h3>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        <p className="text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed">
          {note.content?.replace(/<[^>]*>/g, '') || "No additional content..."}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {note.category?.slice(0, 2).map(cat => (
            <span key={cat} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
              <Tag size={10} /> {cat}
            </span>
          ))}
        </div>
      </div>

      <div className={`flex items-center gap-4 text-gray-500 text-xs mt-4 ${isGrid ? 'pt-4 border-t border-gray-700/50' : 'ml-6'}`}>
        <span className="flex items-center gap-1.5">
          <Calendar size={14} /> 
          {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
}