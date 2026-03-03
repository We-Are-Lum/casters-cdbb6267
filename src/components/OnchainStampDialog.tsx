import { useState } from "react";
import { X, Stamp, ExternalLink, BookOpen } from "lucide-react";
import { useGame } from "@/contexts/GameContext";

type StampType = "character" | "story";

interface OnchainStampDialogProps {
  open: boolean;
  onClose: () => void;
  type: StampType;
  storyTitle?: string;
}

export default function OnchainStampDialog({ open, onClose, type, storyTitle }: OnchainStampDialogProps) {
  const { character, getPortraitUrl } = useGame();
  const [step, setStep] = useState<"info" | "stamping" | "done">("info");

  if (!open || !character) return null;

  const isStory = type === "story";
  const title = isStory ? "Stamp Story" : "Stamp Character";
  const fee = isStory ? "0.001 ETH" : "0.0005 ETH";

  const handleStamp = async () => {
    setStep("stamping");
    // Stub: onchain stamp transaction on Base
    await new Promise((r) => setTimeout(r, 2000));
    setStep("done");
  };

  const handleClose = () => {
    setStep("info");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-background border border-border w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
          <h2 className="font-display text-sm tracking-widest uppercase text-foreground">{title}</h2>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {step === "info" && (
            <>
              {/* What's being stamped */}
              <div className="flex items-center gap-4">
                {isStory ? (
                  <div className="w-12 h-12 border border-border flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                  </div>
                ) : (
                  <img
                    src={getPortraitUrl(character.portraitIndex)}
                    alt={character.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-border shrink-0"
                  />
                )}
                <div>
                  <h3 className="font-display text-sm text-foreground">
                    {isStory ? storyTitle || "Current Story" : character.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {isStory
                      ? "A record of this play experience"
                      : `${character.faction} · Rep ${character.reputation} · ${character.lum} LUM · ${character.fgld} FGLD`}
                  </p>
                </div>
              </div>

              {/* Explanation */}
              <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                {isStory ? (
                  <>
                    <p>
                      Stamping records this play experience <span className="text-foreground font-medium">permanently onchain</span>.
                      The narrative, choices, and outcomes become an immutable part of your character's history.
                    </p>
                    <p>
                      Only stamped stories have the potential to be woven into the{" "}
                      <span className="text-foreground font-medium">official Casters lore</span>.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Stamping creates an <span className="text-foreground font-medium">onchain snapshot</span> of your
                      character's current state — reputation, tokens, inventory, and tags.
                    </p>
                    <p>
                      You can return to any stamped state later. Think of it as a save point that lives forever on Base.
                    </p>
                    <p>
                      Only stamped characters can become part of the{" "}
                      <span className="text-foreground font-medium">official Casters lore</span>.
                    </p>
                  </>
                )}
              </div>

              {/* Cost */}
              <div className="border border-border/40 p-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Network</span>
                  <span className="text-foreground font-mono">Base</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Stamp fee</span>
                  <span className="text-foreground font-mono">{fee}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Character</span>
                  <span className="text-foreground font-mono">{character.name}</span>
                </div>
              </div>

              <div className="bg-secondary/50 border border-border/40 px-4 py-3 text-[10px] text-muted-foreground leading-relaxed">
                <span className="text-foreground font-display tracking-wider uppercase text-[9px]">Lore eligibility</span>
                <p className="mt-1">
                  Stamped content may be reviewed for inclusion in the official Casters canon. Unstamped sessions are ephemeral — they exist only in memory.
                </p>
              </div>

              <button
                onClick={handleStamp}
                className="w-full py-3 bg-foreground text-background font-display text-xs tracking-widest uppercase hover:opacity-90 transition-opacity"
              >
                Stamp for {fee}
              </button>

              <p className="text-[10px] text-muted-foreground/50 text-center">
                Wallet connection coming soon. This action is not yet live.
              </p>
            </>
          )}

          {step === "stamping" && (
            <div className="text-center space-y-4 py-8">
              <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-display text-xs tracking-widest text-muted-foreground uppercase animate-pulse">
                Stamping onchain...
              </p>
            </div>
          )}

          {step === "done" && (
            <div className="text-center space-y-4 py-4">
              <Stamp className="h-8 w-8 text-foreground mx-auto" />
              <div>
                <h3 className="font-display text-sm text-foreground">Stamped</h3>
                <p className="text-xs text-muted-foreground mt-2">
                  {isStory
                    ? "This story is now part of the permanent record."
                    : `${character.name}'s current state has been recorded onchain.`}
                </p>
              </div>
              <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink className="h-3 w-3" />
                View on BaseScan
              </button>
              <button
                onClick={handleClose}
                className="w-full py-3 border border-border text-foreground font-display text-xs tracking-widest uppercase hover:bg-foreground hover:text-background transition-all"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
