import { useState, useEffect, useCallback } from "react";
import { Save, Plus, Trash2, FileText } from "lucide-react";

const NotesApp = () => {
  const [notes, setNotes] = useState<{ id: string; title: string; content: string }[]>(() => {
    const saved = localStorage.getItem("vyom-notes");
    return saved ? JSON.parse(saved) : [{ id: "1", title: "Welcome", content: "Welcome to VYOM Notes!\n\nStart typing to create your notes." }];
  });
  const [activeId, setActiveId] = useState(notes[0]?.id || "");

  const activeNote = notes.find((n) => n.id === activeId);

  useEffect(() => {
    localStorage.setItem("vyom-notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const id = Date.now().toString();
    setNotes((prev) => [...prev, { id, title: "Untitled", content: "" }]);
    setActiveId(id);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeId === id) setActiveId(notes[0]?.id || "");
  };

  const updateNote = useCallback((field: "title" | "content", value: string) => {
    setNotes((prev) => prev.map((n) => (n.id === activeId ? { ...n, [field]: value } : n)));
  }, [activeId]);

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-44 border-r border-border bg-secondary/20 flex flex-col">
        <div className="p-2 border-b border-border">
          <button
            onClick={addNote}
            className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-body hover:bg-primary/20 transition-colors"
          >
            <Plus className="w-3 h-3" /> New Note
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {notes.map((n) => (
            <button
              key={n.id}
              onClick={() => setActiveId(n.id)}
              className={`w-full text-left px-3 py-2 text-xs font-body border-b border-border/50 flex items-center gap-2 transition-colors ${
                activeId === n.id ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-secondary/50"
              }`}
            >
              <FileText className="w-3 h-3 shrink-0" />
              <span className="truncate">{n.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {activeNote ? (
          <>
            <div className="flex items-center gap-2 p-2 border-b border-border">
              <input
                value={activeNote.title}
                onChange={(e) => updateNote("title", e.target.value)}
                className="flex-1 bg-transparent text-foreground font-display text-xs tracking-wider focus:outline-none"
                placeholder="Note title..."
              />
              <button
                onClick={() => deleteNote(activeNote.id)}
                className="p-1.5 rounded hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-3 h-3 text-destructive" />
              </button>
              <div className="flex items-center gap-1 text-primary/50">
                <Save className="w-3 h-3" />
                <span className="text-[10px] font-mono-tech">AUTO-SAVED</span>
              </div>
            </div>
            <textarea
              value={activeNote.content}
              onChange={(e) => updateNote("content", e.target.value)}
              className="flex-1 bg-transparent p-4 text-foreground/90 font-body text-sm resize-none focus:outline-none leading-relaxed"
              placeholder="Start typing..."
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground font-mono-tech text-sm">
            No note selected
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesApp;
