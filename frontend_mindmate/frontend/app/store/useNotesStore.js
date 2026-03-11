import { create } from "zustand";
import { axiosinstance } from "../lib/axios";
import { toast } from "react-hot-toast"; 
import { Link } from "lucide-react";
import { summary } from "framer-motion/client";
//import { set } from "mongoose";

export const useNotesStore = create((set,get)=>({
    notes: [], // Array of all notes for the user 
    selectedNote: null, // The note currently being viewed/edited on /notes/[id]
    isLoading: false,
    error: null,
    summary : null,
      clearSelectedNote: () => set({ selectedNote: null }),

      createNote: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosinstance.post("/notes/create",formData,
               { withcredentials : true}
            ); // Maps to getNotesbyid
            console.log(response.data)
            
            set({ 
                selectedNote: response.data.data, 
                isLoading: false 
            });
            return response.data.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Note not found.', isLoading: false });
            return null;
        }
    },
     updateNote: async (noteId,formData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosinstance.put(`/notes/update/${noteId}`, formData,
              { withCredentials: true }
            ); // Maps to getNotesbyid
            console.log(response.data)
            
            set({ 
                selectedNote: response.data.data, 
                isLoading: false 
            });
            return response.data.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Note not found.', isLoading: false });
            return null;
        }
    },
    fetchNotes: async()=>{
         try{ set({isLoading : true})
          const res = await axiosinstance.get("/notes/")
           set({ 
                notes: res.data.data,
                isLoading: false 
            });
            console.log(res.data)
        }catch(error){
            
            set({ error: error.response?.data?.message || 'Failed to fetch notes.', isLoading: false });
        
        }
    },
    fetchNoteById: async (noteId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosinstance.get(`/notes/${noteId}`,
               { withcredentials : true}
            ); // Maps to getNotesbyid
            console.log(response.data)
            console.log(noteId)
            set({ 
                selectedNote: response.data.data, 
                isLoading: false 
            });
            return response.data.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Note not found.', isLoading: false });
            return null;
        }
    },
    aiSummary: async (noteId,formData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosinstance.post(`/notes/ai/${noteId}/summarize`,
               { withcredentials : true}
            ); // Maps to getNotesbyid
            console.log(response.data)
            console.log(noteId)
            set({ 
                summary: response.data.data, 
                isLoading: false 
            });
            return response.data.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Note not found.', isLoading: false });
            return null;
        }
    },

}))
