import express from "express";
import { verifyJWT } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";
import {
    createnotes,
    updateNote,
    deletenotes,
    aiSummarizeNote,
   getNotesbyid,
   getAllNotes
} from "../controllers/Notescontroller.js";
import { transcribeAudio } from "../utils/groqAi.js";

const router = express.Router();

// Protect all routes
router.use(verifyJWT);


router
.route("/create")
.post(upload.fields([{ name: "audio", maxCount: 1 }]), createnotes);


router
.route("/update/:id")
.put(upload.fields([{ name: "audio", maxCount: 1 }]), updateNote);

router.route("/delete/:id").delete(deletenotes);
router.route("/").get(getAllNotes);
router.route("/:id").get(getNotesbyid);
 router.route("/ai/summarize").post(aiSummarizeNote);
router.post(
  "/notes/ai/transcribe",
  upload.single("audio"),
  transcribeAudio
);
export default router;
