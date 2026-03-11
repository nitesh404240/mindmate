import express from "express";
import { verifyJWT } from "../middleware/auth.js";

import {
    createnotes,
    updateNote,
    deletenotes,
    aiSummarizeNote,
  
   saveVoiceTranscript,
   getNotesbyid,
   getAllNotes
} from "../controllers/Notescontroller.js";

const router = express.Router();

// Protect all routes
router.use(verifyJWT);

// AI Feature Routes (router.route format)
router.route("/create").post(createnotes);
router.route("/update/:id").put(updateNote);
router.route("/delete").delete(deletenotes);
router.route("/").get(getAllNotes);
router.route("/:id").get(getNotesbyid);
 router.route("/ai/summarize").post(aiSummarizeNote);

 
router.route("/voice/:id/save").post(saveVoiceTranscript);

export default router;
