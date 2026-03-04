import { useState, useRef, useEffect } from "react";
import { Send, Trash2 } from "lucide-react";
import { useChroniclerChat } from "@/hooks/useChroniclerChat";
import CharacterRecommendation from "@/components/CharacterRecommendation";
import StoryStampPrompt from "@/components/StoryStampPrompt";

export default function ChroniclerChat() {
  const { messages, isLoading, send, clearMessages, isOnboarding } = useChroniclerChat();
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

  const emptyPrompts = isOnboarding
    ? [
        "I want to play a shadowy fixer",
        "I like diplomacy and knowledge",
        "I want to be a ruthless trader",
      ]
    : [
        "What quests are active?",
        "Tell me about the factions",
        "What happened at the Ember Gate?",
      ];

  const emptyTitle = isOnboarding
    ? "AELIA AWAITS YOUR ARRIVAL"
    : "AELIA AWAITS";

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Minimal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
        <span className="font-display text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Casters
        </span>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="text-muted-foreground/50 hover:text-foreground transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8 space-y-8">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 opacity-60">
            <p className="font-display text-lg md:text-base text-muted-foreground tracking-widest mb-8">
              {emptyTitle}
            </p>
            <div className="flex flex-wrap gap-3 justify-center max-w-md">
              {emptyPrompts.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-base md:text-sm px-5 py-3 border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-300 bg-background"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i}>
            <div
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[65%] leading-relaxed ${
                  msg.role === "user"
                    ? "text-base md:text-sm text-foreground font-medium"
                    : "text-base md:text-[15px] text-muted-foreground font-serif italic"
                }`}
              >
                <span className="whitespace-pre-wrap">{msg.content}</span>
              </div>
            </div>
            {/* Show character recommendations inline */}
            {msg.characters && msg.characters.length > 0 && (
              <div className="max-w-[80%] md:max-w-[60%] mt-4">
                <CharacterRecommendation characters={msg.characters} />
              </div>
            )}
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start">
            <span className="text-xs text-muted-foreground/40 font-display tracking-widest animate-pulse">
              WRITING...
            </span>
          </div>
        )}

        {/* Story stamp prompt — appears every 10 assistant messages */}
        {!isOnboarding && !isLoading && messages.filter(m => m.role === "assistant").length > 0 &&
          messages.filter(m => m.role === "assistant").length % 10 === 0 && (
          <StoryStampPrompt storyTitle="Current Session" />
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 md:p-6 bg-background">
        <div className="relative max-w-4xl mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isOnboarding ? "Tell Aelia who you want to be..." : "Speak to Aelia..."}
            rows={1}
            className="w-full resize-none bg-transparent border-b border-border/40 py-3 pr-12 text-lg md:text-base text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-foreground/30 transition-colors font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
