import { X, Info } from "lucide-react";

interface CharacterInfoSheetProps {
  open: boolean;
  onClose: () => void;
}

export default function CharacterInfoSheet({ open, onClose }: CharacterInfoSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background border border-border w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
          <h2 className="font-display text-sm tracking-widest uppercase text-foreground">
            How Characters Work
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs text-muted-foreground leading-relaxed">
          {/* Section: Playing */}
          <div className="space-y-2">
            <h3 className="font-display text-[11px] tracking-widest uppercase text-foreground">
              Playing a Character
            </h3>
            <p>
              Characters are social positions in the Luminous City — fixers, archivists, wardens, traders.
              They differ by <span className="text-foreground">who they can influence</span> and{" "}
              <span className="text-foreground">what doors open for them</span>.
            </p>
            <p>
              You can only play <span className="text-foreground font-medium">one character at a time</span>.
              Your active character is stored with your session. Speak to Aelia in the main story to discover
              or design your character.
            </p>
          </div>

          {/* Section: Minting */}
          <div className="space-y-2">
            <h3 className="font-display text-[11px] tracking-widest uppercase text-foreground flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 bg-foreground rounded-full" />
              Minting
            </h3>
            <p>
              Minting creates a <span className="text-foreground font-medium">permanent NFT</span> of your
              character on Base. Without minting, your character exists only in your current session and may be lost.
            </p>
            <p>
              Mint multiple characters to build a roster. Switch between them, but only one can be active at a time.
            </p>
          </div>

          {/* Section: Stamping */}
          <div className="space-y-2">
            <h3 className="font-display text-[11px] tracking-widest uppercase text-foreground flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 bg-foreground rounded-full" />
              Stamping
            </h3>
            <p>
              Stamping records a <span className="text-foreground font-medium">snapshot</span> of your character's
              current state onchain — reputation, tokens, inventory, everything. Think of it as a save point
              that lives forever.
            </p>
            <p>
              You can also stamp <span className="text-foreground font-medium">stories</span> — play experiences
              that capture the narrative, choices, and outcomes of a session.
            </p>
          </div>

          {/* Section: Lore */}
          <div className="space-y-2 border-t border-border/40 pt-5">
            <h3 className="font-display text-[11px] tracking-widest uppercase text-foreground">
              Official Lore
            </h3>
            <p>
              Only <span className="text-foreground font-medium">stamped</span> characters and stories have
              the potential to be incorporated into the official current lore of the Casters world.
            </p>
            <p>
              Unstamped sessions are ephemeral — they exist only in memory. The city remembers what is recorded.
            </p>
          </div>

          {/* Section: Economy */}
          <div className="space-y-2 border-t border-border/40 pt-5">
            <h3 className="font-display text-[11px] tracking-widest uppercase text-foreground">
              Tokens & Economy
            </h3>
            <div className="space-y-1.5">
              <p>
                <span className="text-foreground font-mono">$LUM</span> — Staked during key moments to signal
                commitment. Locks you into positions, grants credibility, but can paint a target.
              </p>
              <p>
                <span className="text-foreground font-mono">$FGLD</span> — Used for alliances, bribes, and
                negotiations. Spending is visible. People remember who paid.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
