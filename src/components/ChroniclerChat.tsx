import { useState, useRef, useEffect } from "react";
import { ScrollText, Send, Trash2 } from "lucide-react";
import { useChroniclerChat } from "@/hooks/useChroniclerChat";

export default function ChroniclerChat() {
  const { messages, isLoading, send, clearMessages } = useChroniclerChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    send(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <ScrollText className="h-5 w-5 text-primary" />
          <span className="font-display text-sm tracking-widest text-primary uppercase">The Chronicler</span>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            title="Clear conversation"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <ScrollText className="h-10 w-10 text-primary/40 mb-4 animate-float" />
            <p className="font-display text-sm text-muted-foreground tracking-wider mb-2">
              The Chronicler awaits
            </p>
            <p className="text-xs text-muted-foreground/70 italic max-w-xs">
              Ask about the world, your quests, the factions, or declare your intent. Every word shapes the story.
            </p>
            <div className="flex flex-wrap gap-2 mt-6 justify-center">
              {[
                "What quests are active?",
                "Tell me about the factions",
                "What happened at the Ember Gate?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border text-secondary-foreground hover:border-primary/50 hover:text-primary transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary/15 text-foreground border border-primary/20"
                  : "gradient-card border border-border text-secondary-foreground italic"
              }`}
            >
              {msg.role === "assistant" && (
                <span className="text-xs font-display tracking-wider text-primary block mb-1 not-italic">
                  The Chronicler
                </span>
              )}
              <span className="whitespace-pre-wrap">{msg.content}</span>
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start">
            <div className="gradient-card border border-border rounded-lg px-4 py-2.5">
              <span className="text-xs font-display tracking-wider text-primary block mb-1">
                The Chronicler
              </span>
              <span className="text-sm text-muted-foreground animate-pulse-gold">The quill moves...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-border p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Speak to the Chronicler..."
            rows={1}
            className="flex-1 resize-none bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 font-body"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
