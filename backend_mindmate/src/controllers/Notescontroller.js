import { asynchandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { APIResponse } from "../utils/ApiResponse.js";
import { Notes } from "../models/NoteModel/notemodel.js";
//import { groq } from "@groq-ai/client";
import {uploadOncloudinary ,deleteFromCloudinary ,getPublicIdFromUrl} from "../utils/cloudinaryconnect.js"
import groq from "../utils/groqAi.js";
import { getGroqResponse } from "../utils/groqAi.js";

// export const createnotes = asynchandler(async (req, res) => {
//   const userId = req.user._id;
//   const { title, content, category } = req.body;
//   //console.log(req.body);
//   if (!content) {
//     return res.status(400).json({ error: "Content is required" });
//   }
//   let finalTitle = title;

//   // If no title → generate using AI
//   if (!title || title.trim() === "") {
//     const prompt = `Generate a concise and relevant title for the following note around 5-6 words on this content:\n\n${content}\n\nTitle:`;
//     finalTitle = await getGroqResponse(prompt);
//   }

//   const notes = await Notes.create({
//     userId: req.user._id,
//     title: finalTitle,
//     content,
//     category,
//   });

//   if (!notes) {
//     throw new ApiError(400, "Error in creating note");
//   }

//   res
//     .status(201)
//     .json(new APIResponse(true, "Note created successfully", notes));
// });
export const createnotes = asynchandler(async (req, res) => {

const userId = req.user._id;
const { title, content, category } = req.body;

if (!userId) {
throw new ApiError(404, "no user found");
}

let audioUrl = "";

const audioLocalPath = req.files?.audio?.[0]?.path;

if (audioLocalPath) {
const uploadedAudio = await uploadOncloudinary(audioLocalPath);
audioUrl = uploadedAudio?.url || "";
}

const placeholderTitle = await getGroqResponse(
"Generate a short placeholder title (5-6 words) for a new note."
);

const notes = await Notes.create({
userId: userId,
title: title || placeholderTitle || "",
content: content,
category: category,
audioUrl: audioUrl
});

if (!notes) {
throw new ApiError(400, "Error in creating draft note");
}

res.status(201).json(
new APIResponse(true, "note created successfully", notes)
);

});


export const updateNote = asynchandler(async (req, res) => {

const noteId = req.params.id;
console.log("wrjngwr")
if (!noteId) {
throw new ApiError(404, "no note found");
}

const { title, content, category, removeAudio } = req.body;

let finalTitle = title;

if (!title || title.trim() === "") {
const prompt = `Generate a concise and relevant title for the following note around 5-6 words on this content:\n\n${content}\n\nTitle:`;
finalTitle = await getGroqResponse(prompt);
}

const note = await Notes.findById(noteId);

if (!note) {
throw new ApiError(404, "Note not found");
}

/* ---------- AUDIO UPLOAD ---------- */

const audioLocalPath = req.files?.audio?.[0]?.path;

if (audioLocalPath) {


const uploadedAudio = await uploadOncloudinary(audioLocalPath);

note.audioUrl = uploadedAudio?.url || "";

}

/* ---------- REMOVE AUDIO ---------- */

if (removeAudio === "true") {
note.audioUrl = "";
}

/* ---------- UPDATE OTHER FIELDS ---------- */

if (title) note.title = finalTitle;
if (content) note.content = content;
if (category) note.category = category;

await note.save();

res.status(200).json(
new APIResponse(true, "Note updated successfully", note)
);

});


export const deletenotes = asynchandler(async (req, res) => {
  const noteId = req.params.id;
  console.log("wkjnw");
  if(!noteId){
    throw new ApiError(404,"no note dounf")
  }

  const note = await Notes.findByIdAndDelete(noteId);
  
  res.status(200).json(new APIResponse(true, "Note updated successfully", {}));
});
export const aiSummarizeNote = asynchandler(async (req, res) => {
  //const noteId = 3513546843546;
  console.log("i am called")
  const { prompt,content } = req.body;

  //console.log(prompt,content)
  const user = req.user;
  console.log(user);
  if (!user) {
    throw new ApiError(404, "no authorized user found");
   }
 console.log("summary")
  let finalprompt;
  if (!prompt || prompt.trim() === "") {
    finalprompt = `Summarize the following note content in a concise manner:\n\n${content}\n\nSummary:`;
  } else {
    finalprompt = `${prompt}:\n\n${content}\n\nSummary:`;
  }

  //console.log("Prompt sent to AI:", finalprompt); // Debugging

  const summary = await getGroqResponse(finalprompt);
  if (!summary) {
    throw new ApiError(500, "Error in generating summary");
  }
  
  console.log(summary)
  return res.status(200).json(
    new APIResponse(true, "Note summarized successfully", 
      summary
    )
  );
});


export const getAllNotes = asynchandler(async (req, res) => {
  const userId = req.user._id;
  if(!userId){
     throw new ApiError(404,"no user found")
  }
  const notes = await Notes.find({ userId }).sort({ createdAt: -1 });
  res.status(200).json(new APIResponse(true, "Notes fetched successfully", notes));
});
export const getNotesbyid = asynchandler(async (req, res) => {
  const noteId = req.params.id
  console.log(noteId)
if(!noteId){
    throw new ApiError(404,"noteId  not found")
  }
  const note = await Notes.findById(noteId)
  if(!note){
    throw new ApiError(404,"note not found")
  }
  res.status(200).json(new APIResponse(true, "Notes fetched successfully", note));
});


export default {
  createnotes,
  aiSummarizeNote, 
  updateNote,
  
  deletenotes,
  getAllNotes,
  getNotesbyid
};
