import { Shield, Star } from "lucide-react";
import type { Character } from "@/lib/mockData";
import { getFactionColor, getFactionBgColor } from "@/lib/mockData";

interface Props {
  character: Character;
}

export default function CharacterPanel({ character }: Props) {
  return (
    <div className="gradient-card rounded-lg border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-4 w-4 text-primary" />
        <h3 className="font-display text-sm tracking-widest text-primary uppercase">Character</h3>
      </div>

      <div className="text-center mb-4">
        <div className="w-16 h-16 rounded-full bg-faction-azure/20 border-2 border-faction-azure/50 mx-auto mb-3 flex items-center justify-center">
          <span className="font-display text-xl font-bold text-faction-azure">
            {character.name.split(" ").map(n => n[0]).join("")}
          </span>
        </div>
        <h4 className="font-display text-lg font-bold text-foreground">{character.name}</h4>
        <span className={`inline-block mt-1 text-xs font-display tracking-wider px-2 py-0.5 rounded-full ${getFactionBgColor(character.faction)} ${getFactionColor(character.faction)}`}>
          {character.faction}
        </span>
      </div>

      {/* Reputation */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-display tracking-wider text-muted-foreground">REPUTATION</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-primary" />
            <span className="text-xs font-mono text-primary">{character.reputation}/100</span>
          </div>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${character.reputation}%` }}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {character.reputationTags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-display"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border">
        <div className="text-xs text-muted-foreground font-mono">{character.walletAddress}</div>
      </div>
    </div>
  );
}
