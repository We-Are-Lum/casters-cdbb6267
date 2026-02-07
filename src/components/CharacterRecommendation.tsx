import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { CHARACTER_IMAGES } from "@/lib/characterImages";
import { useGame } from "@/contexts/GameContext";
import { useNavigate } from "react-router-dom";
import type { Faction } from "@/lib/mockData";

export interface RecommendedCharacter {
  name: string;
  faction: Faction;
  role: string;
  backstory: string;
  strengths: string;
  weaknesses: string;
}

interface Props {
  characters: RecommendedCharacter[];
  onSelected?: () => void;
}

export default function CharacterRecommendation({ characters, onSelected }: Props) {
  const { selectCharacter } = useGame();
  const navigate = useNavigate();
  const [saving, setSaving] = useState<number | null>(null);

  const handlePick = async (char: RecommendedCharacter, index: number) => {
    setSaving(index);
    const portraitIndex = Math.floor(Math.random() * CHARACTER_IMAGES.length);
    const id = await selectCharacter({
      name: char.name,
      faction: char.faction,
      backstory: char.backstory,
      role: char.role,
      strengths: char.strengths,
      weaknesses: char.weaknesses,
      portraitIndex,
    });
    if (id) {
      onSelected?.();
      navigate(`/dashboard?character=${id}`);
    }
    setSaving(null);
  };

  return (
    <div className="space-y-3 my-2">
      {characters.map((char, i) => (
        <button
          key={i}
          onClick={() => handlePick(char, i)}
          disabled={saving !== null}
          className="w-full text-left border border-border/60 hover:border-foreground/30 p-4 transition-all duration-300 bg-background group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-medium text-foreground group-hover:text-foreground">
                  {char.name}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border px-1.5 py-0.5">
                  {char.faction}
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground/60 block">{char.role}</span>
              <p className="text-xs text-muted-foreground leading-relaxed font-serif italic">
                "{char.backstory}"
              </p>
              <div className="flex gap-4 text-[10px]">
                <span className="text-emerald-500/80">✦ {char.strengths}</span>
                <span className="text-red-400/80">⚠ {char.weaknesses}</span>
              </div>
            </div>
            <div className="flex-shrink-0 mt-1">
              {saving === i ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-foreground transition-colors" />
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
