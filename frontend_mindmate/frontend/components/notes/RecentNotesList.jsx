"use client"
import Link from 'next/link';
import { Mic, FileText, MoreVertical, Clock } from 'lucide-react';
import {useNotesStore} from "../../app/store/useNotesStore"
import { useEffect } from 'react';

const getNoteIcon = (type) => {
    switch (type) {
        case 'Voice':
            return <Mic size={18} className="text-indigo-400" />;
        case 'Text':
        default:
            return <FileText size={18} className="text-green-400" />;
    }
};


export default function RecentNotesList({ limit = 5 }) {
    const {fetchNotes , notes , isLoading} = useNotesStore();

    useEffect(()=>{
        if (notes.length === 0) { 
             fetchNotes();
        }
    },[fetchNotes,notes.length])
    console.log(notes)
    const notesToShow = notes.slice(0, limit);
     console.log(notesToShow)
    if (notesToShow.length === 0) {
        return <p className="text-gray-400 text-center py-8">No recent notes found. Start a new one above!</p>;
    }
    if (isLoading && notes.length === 0) {
        return <p className="text-gray-400 text-center py-8">Loading recent notes...</p>;
         }

    return (
        <div className="space-y-3">
            {notesToShow.map((note) => (
                <Link 
                    key={note._id} 
                    href={`/notes/${note._id}`}
                    // The Card Style: Clean, Interactive, Dark-Themed
                    className="flex items-center justify-between p-3 bg-gray-800/70 rounded-lg 
                               hover:bg-indigo-600/30 transition duration-200 border border-transparent hover:border-indigo-500/50"
                >
                    <div className="flex items-center space-x-3 truncate">
                        {/* Icon - Uses color to denote type (Voice vs. Text) */}
                        <div className="flex-shrink-0">
                            {getNoteIcon(note.type)}
                        </div>
                        
                        {/* Title - Primary focus text */}
                        <span className="text-white font-medium truncate">
                            {note.title}
                        </span>
                    </div>

                    <div className="flex items-center space-x-4 flex-shrink-0">
                         <div className="text-sm text-gray-400 flex items-center">
                            <Clock size={14} className="mr-1" />
                            {note.date}
                        </div>
                        
                        {/* Action Menu (e.g., Delete, Archive) */}
                        <button 
                            className="text-gray-400 hover:text-white transition" 
                            aria-label={`More options for ${note.title}`}
                            onClick={(e) => { 
                                e.preventDefault(); 
                                // Implement overflow menu logic here
                                console.log(`Opening menu for note ${note.id}`);
                            }}
                        >
                            <MoreVertical size={18} />
                        </button>
                    </div>
                </Link>
            ))}
            
            {/* Link to All Notes Page */}
            <div className="pt-2 text-center">
                <Link href="/notes" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition">
                    View All Notes →
                </Link>
            </div>
        </div>
    );
}