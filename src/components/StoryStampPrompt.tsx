import { useState } from "react";
import { Stamp, X } from "lucide-react";
import OnchainStampDialog from "@/components/OnchainStampDialog";

interface StoryStampPromptProps {
  storyTitle?: string;
}

export default function StoryStampPrompt({ storyTitle }: StoryStampPromptProps) {
  const [dismissed, setDismissed] = useState(false);
  const [stampOpen, setStampOpen] = useState(false);

  if (dismissed) return null;

  return (
    <>
      <div className="mx-auto max-w-[80%] md:max-w-[60%] border border-border/60 bg-secondary/30 p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Stamp className="h-4 w-4 text-foreground shrink-0" />
            <span className="font-display text-xs tracking-widest uppercase text-foreground">
              Stamp this story?
            </span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-muted-foreground/50 hover:text-foreground transition-colors -mt-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Record this play experience onchain. Only stamped stories have the potential to become part of the official Casters lore.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setStampOpen(true)}
            className="px-4 py-2 bg-foreground text-background font-display text-[10px] tracking-widest uppercase hover:opacity-90 transition-opacity"
          >
            Stamp for 0.001 ETH
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="px-4 py-2 border border-border text-muted-foreground font-display text-[10px] tracking-widest uppercase hover:text-foreground hover:border-foreground/30 transition-all"
          >
            Skip
          </button>
        </div>
      </div>
      <OnchainStampDialog
        open={stampOpen}
        onClose={() => setStampOpen(false)}
        type="story"
        storyTitle={storyTitle}
      />
    </>
  );
}
