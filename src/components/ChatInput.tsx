import { Send, Paperclip, Loader2 } from "lucide-react";
import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { cn } from "../lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  onAttachFiles: (files: File[]) => void;
  isLoading: boolean;
  globalFilesCount: number;
}

export function ChatInput({
  onSend,
  onAttachFiles,
  isLoading,
  globalFilesCount,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Block API keys in chat
    if (message.match(/sk-[a-zA-Z0-9]{20,}/) || message.match(/AIza[0-9A-Za-z-_]{35}/)) {
      alert("⚠️ Please do not paste API keys in chat. For your security, register API keys via Settings → Integrations. I cannot process keys provided here.");
      return;
    }

    if (message.trim() || globalFilesCount > 0) {
      onSend(message);
      setMessage("");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files) as File[];
      onAttachFiles(newFiles);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "relative flex items-center gap-2 p-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl transition-all",
        isLoading ? "opacity-50 pointer-events-none" : "",
      )}
    >
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".csv,.xlsx,.json,.txt"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "p-3 rounded-xl transition-colors flex items-center justify-center relative",
          globalFilesCount > 0
            ? "bg-emerald-500/20 text-emerald-400"
            : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
        )}
        title="Upload Datasets"
      >
        <Paperclip className="w-5 h-5" />
        {globalFilesCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {globalFilesCount}
          </span>
        )}
      </button>

      <div className="flex-1 flex flex-col justify-center">
        {globalFilesCount > 0 && (
          <div className="text-xs text-emerald-400 font-medium px-3 pt-1">
            {globalFilesCount} file{globalFilesCount !== 1 ? "s" : ""} attached.
            Ready for analysis.
          </div>
        )}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Predict customer churn and tell me what to do..."
          className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-zinc-500 px-3 py-2 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || (!message.trim() && globalFilesCount === 0)}
        className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </button>
    </form>
  );
}
