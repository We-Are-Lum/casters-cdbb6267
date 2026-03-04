import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Trash2 } from "lucide-react";
import { useGame } from "@/contexts/GameContext";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chronicler-chat`;

export default function SidebarChat() {
  const { character } = useGame();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = useCallback(async (text: string) => {
    const userMsg: Message = { role: "user", content: text };
    const history = [...messages, userMsg];
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const characterContext = character
      ? {
          name: character.name,
          faction: character.faction,
          reputation: character.reputation,
          reputationTags: character.reputationTags,
          lum: character.lum,
          fgld: character.fgld,
          lootBagCount: character.lootBags.length,
          backstory: character.backstory,
        }
      : undefined;

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          characterContext,
          mode: "sidebar",
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        setMessages((prev) => [...prev, { role: "assistant", content: `*${errData.error || "Aelia is silent."}*` }]);
        setIsLoading(false);
        return;
      }

      if (!resp.body) {
        setMessages((prev) => [...prev, { role: "assistant", content: "*Aelia is silent.*" }]);
        setIsLoading(false);
        return;
      }

      let assistantSoFar = "";
      const upsertAssistant = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error("Sidebar chat error:", e);
      setMessages((prev) => [...prev, { role: "assistant", content: "*The connection to Aelia has been severed.*" }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, character]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    send(trimmed);
  };

  const prompts = [
    "What should I do next?",
    "Explain my faction",
    "Who can I trade with?",
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pb-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center text-center py-8 opacity-60">
            <p className="font-display text-xs md:text-[10px] tracking-widest text-muted-foreground uppercase mb-4">
              Ask Aelia
            </p>
            <p className="text-sm md:text-xs text-muted-foreground mb-4 px-2">
              Side conversations stay here — Aelia won't bring these into the main story.
            </p>
            <div className="flex flex-col gap-2 w-full">
              {prompts.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-sm md:text-[11px] px-3 py-2.5 border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[90%] text-sm md:text-xs leading-relaxed ${
                msg.role === "user"
                  ? "text-foreground font-medium"
                  : "text-muted-foreground font-serif italic"
              }`}
            >
              <span className="whitespace-pre-wrap">{msg.content}</span>
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start">
            <span className="text-[10px] text-muted-foreground/40 font-display tracking-widest animate-pulse">
              ...
            </span>
          </div>
        )}
      </div>

      {/* Input + clear */}
      <div className="border-t border-border/40 pt-3 mt-2">
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-1 text-[10px] text-muted-foreground/50 hover:text-foreground mb-2 transition-colors"
          >
            <Trash2 className="h-3 w-3" /> Clear
          </button>
        )}
        <form onSubmit={handleSubmit} className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Aelia..."
            className="w-full bg-transparent border-b border-border/40 py-2 pr-8 text-base md:text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-foreground/30 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <Send className="h-3 w-3" />
          </button>
        </form>
      </div>
    </div>
  );
}
