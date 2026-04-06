"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Edit,
  Save,
  Mic,
  Square,
  Tag,
  X,
  Sparkles,
  FileText,
  ListChecks,
  Lightbulb,
  ChevronLeft,
  Loader2,
  Check,
  Trash2,
  Plus,
  Type,
  Languages,
} from "lucide-react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useNotesStore } from "@/app/store/useNotesStore";
import { axiosinstance } from "@/app/lib/axios";

export default function SingleNotePage() {
  const { id: noteId } = useParams();
  const router = useRouter();
  const textareaRef = useRef(null);

  const { authUser } = useAuthStore();
  const isAuthenticated = Boolean(authUser);
  const isNewNote = noteId === "new";

  const {
    fetchNoteById,
    selectedNote,
    createNote,
    updateNote,
    clearSelectedNote,
    deleteNotes,
  } = useNotesStore();

  /* ================= STATE ================= */
  const [isEditing, setIsEditing] = useState(isNewNote);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [showAIModal, setShowAIModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  /* ================= EFFECTS ================= */
  useEffect(() => {
    if (isNewNote) {
      clearSelectedNote();
      setNoteTitle("");
      setNoteContent("");
      setCategories([]);
    } else {
      fetchNoteById(noteId);
    }
  }, [noteId, isNewNote]);

  useEffect(() => {
    if (selectedNote && !isNewNote) {
      setNoteTitle(selectedNote.title || "");
      setNoteContent(selectedNote.content || "");
      setCategories(selectedNote.category || []);
    }
  }, [selectedNote, isNewNote]);

  /* ================= LOGIC HANDLERS ================= */
  const insertTextAtCursor = (text) => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart || noteContent.length;
    const end = textarea?.selectionEnd || noteContent.length;
    const newContent =
      noteContent.substring(0, start) + text + noteContent.substring(end);
    setNoteContent(newContent);
  };

  const generateSmartTitle = async () => {
    if (!noteContent.trim()) return alert("Write some content first!");
    setIsGeneratingTitle(true);
    try {
      const resp = await axiosinstance.post("/notes/ai/summarize", {
        content: noteContent,
        prompt:
          "Generate a short, 3-5 word catchy title for this note. Return ONLY the title text without quotes.",
      });
      setNoteTitle(resp.data.data.replace(/"/g, ""));
    } catch (e) {
      alert("AI Title generation failed.");
    } finally {
      setIsGeneratingTitle(false);
    }
  };
  const startVoiceCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        const url = URL.createObjectURL(blob);

        setAudioBlob(blob);
        setAudioURL(url);
      };

      mediaRecorder.start();

      setIsRecording(true);
    } catch (err) {
      alert("Mic access denied.");
    }
  };

  const stopVoiceCapture = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
  };

  const handleSave = async () => {
    if (isRecording) stopVoiceCapture();
    const formData = new FormData();

    formData.append("title", noteTitle || "Untitled");
    formData.append("content", noteContent);
    formData.append("category", JSON.stringify(categories));

    if (audioBlob) {
      formData.append("audio", audioBlob, "voice.webm");
    }

    if (!isAuthenticated && isNewNote) {
      localStorage.setItem(
        "tempDraftNote",
        JSON.stringify({
          title: noteTitle,
          content: noteContent,
          category: categories,
        }),
      );

      router.push("/auth/Login?returnUrl=/notes/new");
      return;
    }

    if (isNewNote) {
      const res = await createNote(formData);
      if (res?._id) router.replace(`/notes/${res._id}`);
    } else {
      await updateNote(noteId, formData);
      setIsEditing(false);
    }
  };

  if (!selectedNote && !isNewNote)
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" />
      </div>
    );

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-white pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* HEADER NAV */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition text-xs font-black uppercase tracking-widest"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <div className="flex gap-3">
            {!isNewNote && (
              <button
                onClick={() =>
                  confirm("Delete?") &&
                  deleteNotes(noteId).then(() => router.push("/Dashboard"))
                }
                className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition ${isEditing ? "bg-indigo-600 shadow-lg shadow-indigo-600/20" : "bg-slate-800"}`}
            >
              {isEditing ? (
                <>
                  <Save size={18} /> Save
                </>
              ) : (
                <>
                  <Edit size={18} /> Edit
                </>
              )}
            </button>
          </div>
        </div>

        {/* SMART TITLE INPUT */}
        <div className="group relative mb-6">
          <input
            disabled={!isEditing}
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Note Title..."
            className="w-full bg-transparent text-4xl font-black outline-none border-b border-transparent focus:border-indigo-500/50 pb-2 transition-all pr-12"
          />
          {isEditing && (
            <button
              onClick={generateSmartTitle}
              disabled={isGeneratingTitle}
              className="absolute right-0 bottom-3 p-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
            >
              {isGeneratingTitle ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} />
              )}
            </button>
          )}
        </div>

        {/* TAGS */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => (
            <span
              key={cat}
              className="flex items-center gap-1 px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-wider"
            >
              <Tag size={10} /> {cat}
              {isEditing && (
                <X
                  size={12}
                  className="ml-1 cursor-pointer"
                  onClick={() =>
                    setCategories(categories.filter((c) => c !== cat))
                  }
                />
              )}
            </span>
          ))}

          {isEditing && (
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-full px-3 py-1">
              <input
                className="bg-transparent outline-none text-[10px] w-20 font-bold uppercase"
                placeholder="New Tag"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();

                    const newTag = categoryInput.trim();

                    if (!newTag) return;

                    if (categories.includes(newTag)) return;

                    setCategories((prev) => [...prev, newTag]);
                    setCategoryInput("");
                  }
                }}
              />
              <Plus size={12} className="text-slate-500" />
            </div>
          )}
        </div>

        {/* TOOLBAR */}
        <div className="sticky top-20 z-10 flex items-center gap-3 p-2 bg-[#151921]/90 backdrop-blur-xl border border-slate-800/60 rounded-2xl mb-6 shadow-2xl">
          {isEditing && (
            <button
              onClick={isRecording ? stopVoiceCapture : startVoiceCapture}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isRecording
                  ? "bg-red-600 animate-pulse"
                  : "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
              }`}
            >
              {isRecording ? (
                <>
                  <Square size={16} /> Stop
                </>
              ) : (
                <>
                  <Mic size={16} /> Record Audio
                </>
              )}
            </button>
          )}

          <button
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all text-xs font-bold"
          >
            <Sparkles size={16} /> AI Power Tools
          </button>
        </div>

        {/* EDITOR */}
        <div className="bg-[#151921] border border-slate-800/60 rounded-[2.5rem] p-8 min-h-[500px] shadow-inner relative">
          <textarea
            ref={textareaRef}
            readOnly={!isEditing}
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Start typing your masterpiece..."
            className="w-full h-full min-h-[450px] bg-transparent resize-none outline-none text-lg text-slate-300 leading-relaxed font-medium"
          />
          {audioURL && (
            <div className="mt-6 bg-[#0B0F1A] border border-slate-800 rounded-xl p-4">
              <p className="text-sm text-slate-400 mb-2">Recorded Audio</p>

              <audio controls className="w-full">
                <source src={audioURL} type="audio/webm" />
              </audio>
            </div>
          )}
        </div>
      </div>

      {showAIModal && (
        <AIModal
          content={noteContent}
          onClose={() => setShowAIModal(false)}
          onApply={(val) => insertTextAtCursor("\n\n" + val)}
        />
      )}
    </main>
  );
}

/* ================= POWER AI MODAL ================= */
function AIModal({ onClose, content, onApply }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [view, setView] = useState("menu");

  const tools = [
    {
      name: "Summarize",
      icon: <FileText size={18} />,
      color: "text-indigo-400",
      prompt: "Summarize into concise bullet points.",
    },
    {
      name: "Action Items",
      icon: <ListChecks size={18} />,
      color: "text-emerald-400",
      prompt: "Extract all to-do items and tasks.",
    },
    {
      name: "Rewrite Formal",
      icon: <Type size={18} />,
      color: "text-blue-400",
      prompt: "Rewrite this in a professional, formal tone.",
    },
    {
      name: "Simplify (ELI5)",
      icon: <Lightbulb size={18} />,
      color: "text-yellow-400",
      prompt: "Explain this like I am 5 years old.",
    },
    {
      name: "Fix Grammar",
      icon: <Check size={18} />,
      color: "text-purple-400",
      prompt: "Fix all grammar and formatting errors.",
    },
    {
    name: "Transcribe Audio",
    icon: <Mic size={18} />,
    color: "text-pink-400",
    prompt: "convert this audio into",
    type: "audio"
  }
  ];

 const runAI = async (tool) => {
  setLoading(true);
  setView("result");

  try {

    // 🎤 AUDIO TRANSCRIPTION TOOL
    if (tool.type === "audio") {

      if (!audioBlob) {
        setResult("No recorded audio found.");
        return;
      }

      const formData = new FormData();
      formData.append("audio", audioBlob);

      const resp = await axiosinstance.post(
        "/notes/ai/transcribe",
        formData,
        { withCredentials: true }
      );

      setResult(resp.data.data);

    }

    // 🧠 NORMAL AI TOOLS
    else {

      const resp = await axiosinstance.post(
        "/notes/ai/summarize",
        { content, prompt: tool.prompt },
        { withCredentials: true }
      );

      setResult(resp.data.data);

    }

  } catch (err) {

    setResult("AI request failed.");

  } finally {

    setLoading(false);

  }
};
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-xl bg-[#151921] border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="text-indigo-400" size={20} /> AI Power Tools
          </h2>
          <X className="cursor-pointer text-slate-500" onClick={onClose} />
        </div>

        {view === "menu" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tools.map((t) => (
              <button
                key={t.name}
                onClick={() => runAI(t)}
                className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800 hover:border-indigo-500 rounded-2xl transition-all text-left"
              >
                <span className={t.color}>{t.icon}</span>{" "}
                <span className="font-bold text-sm">{t.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-[#0B0F1A] p-5 rounded-2xl border border-slate-800 text-sm text-slate-300 max-h-72 overflow-y-auto leading-relaxed">
              {loading ? (
                <div className="flex flex-col items-center py-10 gap-2">
                  <Loader2 className="animate-spin text-indigo-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                    Consulting AI...
                  </span>
                </div>
              ) : (
                result
              )}
            </div>
            {!loading && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onApply(result);
                    onClose();
                  }}
                  className="flex-1 bg-indigo-600 py-3 rounded-xl font-bold text-sm"
                >
                  Append to Note
                </button>
                <button
                  onClick={() => setView("menu")}
                  className="px-6 bg-slate-800 rounded-xl text-sm font-bold"
                >
                  Back
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
