import mongoose from "mongoose";

const NotesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
     
    },

    content: {
      type: String,
  
    },
    category: {
      type: [String],
      default: [],
    },
    
    aiSummary: {
      type: String,
      default: "",
    }
   ,

    VoiceToNotes: { 
        type: String,
         default: "" 
    }, 

  isDraft: { type: Boolean, default: true },

    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Notes = mongoose.model("Notes", NotesSchema);
