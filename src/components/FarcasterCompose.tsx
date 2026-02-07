import { useState } from "react";
import { X, ExternalLink, Copy, Check } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  hashtag: string;
  questTitle: string;
}

export default function FarcasterCompose({ open, onClose, hashtag, questTitle }: Props) {
  const { character, getFarcasterIntentUrl } = useGame();
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  if (!open || !character) return null;

  const defaultText = `I stand with the ${character.faction} in "${questTitle}."`;
  const castText = text.trim() || defaultText;
  const intentUrl = getFarcasterIntentUrl(castText, hashtag);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${castText}\n\n${hashtag}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied to clipboard" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-background border border-border w-full max-w-md mx-4 p-6 space-y-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-foreground" />
            <h2 className="font-display text-sm tracking-widest uppercase">Post on Farcaster</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>

        <p className="text-xs text-muted-foreground">
          Declare your allegiance. Your post with <span className="font-mono text-foreground">{hashtag}</span> will be tracked by the Chronicler.
        </p>

        {/* Compose area */}
        <div className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 320))}
            rows={3}
            placeholder={defaultText}
            className="w-full py-3 px-4 border border-border bg-transparent text-foreground text-sm resize-none focus:outline-none focus:border-foreground/50 placeholder:text-muted-foreground/40"
          />
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-muted-foreground font-mono">{(text || defaultText).length + hashtag.length + 2}/320</span>
            <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy text"}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 border border-border/50 bg-card space-y-2">
          <span className="text-[10px] font-display tracking-widest text-muted-foreground uppercase">Preview</span>
          <p className="text-sm text-foreground leading-relaxed">{castText}</p>
          <p className="text-sm font-mono text-foreground">{hashtag}</p>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-1">
            <span>by {character.name}</span>
            <span>·</span>
            <span>{character.faction}</span>
          </div>
        </div>

        {/* Post button — opens Warpcast */}
        <a
          href={intentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 bg-foreground text-background text-xs font-display uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <ExternalLink className="h-3 w-3" />
          Open in Warpcast
        </a>
      </div>
    </div>
  );
}
