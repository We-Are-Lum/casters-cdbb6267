import { useState } from "react";
import { X, Sparkles, ExternalLink } from "lucide-react";
import { useGame } from "@/contexts/GameContext";

interface MintCharacterDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function MintCharacterDialog({ open, onClose }: MintCharacterDialogProps) {
  const { character, getPortraitUrl } = useGame();
  const [step, setStep] = useState<"info" | "confirm" | "minting" | "done">("info");

  if (!open || !character) return null;

  const handleMint = async () => {
    setStep("minting");
    // Stub: This is where the Base chain mint would happen
    // via Thirdweb SDK, wallet connection, etc.
    await new Promise((r) => setTimeout(r, 2000)); // Simulate
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
          <h2 className="font-display text-sm tracking-widest uppercase text-foreground">
            Mint Character
          </h2>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {step === "info" && (
            <>
              {/* Character preview */}
              <div className="flex items-center gap-4">
                <img
                  src={getPortraitUrl(character.portraitIndex)}
                  alt={character.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-border"
                />
                <div>
                  <h3 className="font-display text-base text-foreground">{character.name}</h3>
                  <p className="text-xs text-muted-foreground">{character.faction}</p>
                  <p className="text-[10px] text-muted-foreground/60 font-mono mt-1">
                    Rep: {character.reputation} · {character.lum} LUM · {character.fgld} FGLD
                  </p>
                </div>
              </div>

              {/* What minting does */}
              <div className="space-y-3">
                <h4 className="font-display text-xs tracking-widest uppercase text-muted-foreground">
                  What minting does
                </h4>
                <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                  <p>
                    Minting saves your character <span className="text-foreground font-medium">permanently onchain</span> as
                    an NFT on Base. Without minting, your character exists only in your current session.
                  </p>
                  <p>
                    Minted characters can be <span className="text-foreground font-medium">stamped</span> — creating onchain
                    snapshots of their state that you can return to. Only stamped characters and stories have the potential to
                    become part of the <span className="text-foreground font-medium">official Casters lore</span>.
                  </p>
                  <p>
                    You can mint multiple characters, but you can only <span className="text-foreground font-medium">play one at a time</span>.
                  </p>
                </div>
              </div>

              {/* Mint details */}
              <div className="border border-border/40 p-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Network</span>
                  <span className="text-foreground font-mono">Base</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Cost</span>
                  <span className="text-foreground font-mono">Free + gas</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Standard</span>
                  <span className="text-foreground font-mono">ERC-721</span>
                </div>
              </div>

              <button
                onClick={() => setStep("confirm")}
                className="w-full py-3 bg-foreground text-background font-display text-xs tracking-widest uppercase hover:opacity-90 transition-opacity"
              >
                Continue to Mint
              </button>
            </>
          )}

          {step === "confirm" && (
            <>
              <div className="text-center space-y-4">
                <Sparkles className="h-8 w-8 text-foreground mx-auto" />
                <div>
                  <h3 className="font-display text-sm text-foreground">Ready to mint?</h3>
                  <p className="text-xs text-muted-foreground mt-2">
                    This will create an NFT of <span className="text-foreground">{character.name}</span> on Base.
                    You'll need a wallet with a small amount of ETH for gas.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("info")}
                  className="flex-1 py-3 border border-border text-muted-foreground font-display text-xs tracking-widest uppercase hover:text-foreground hover:border-foreground/30 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleMint}
                  className="flex-1 py-3 bg-foreground text-background font-display text-xs tracking-widest uppercase hover:opacity-90 transition-opacity"
                >
                  Mint on Base
                </button>
              </div>

              <p className="text-[10px] text-muted-foreground/50 text-center">
                Wallet connection coming soon. This action is not yet live.
              </p>
            </>
          )}

          {step === "minting" && (
            <div className="text-center space-y-4 py-8">
              <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-display text-xs tracking-widest text-muted-foreground uppercase animate-pulse">
                Minting...
              </p>
            </div>
          )}

          {step === "done" && (
            <div className="text-center space-y-4 py-4">
              <Sparkles className="h-8 w-8 text-foreground mx-auto" />
              <div>
                <h3 className="font-display text-sm text-foreground">Character Minted</h3>
                <p className="text-xs text-muted-foreground mt-2">
                  {character.name} now exists onchain. You can stamp their state at any time.
                </p>
              </div>
              <button
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
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
