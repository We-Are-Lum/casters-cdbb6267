import { Link } from "react-router-dom";
import { Package, Scroll, MessageSquare } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { getFactionColor, getFactionBgColor } from "@/lib/mockData";

export default function CharacterHeader() {
  const { character, getPortraitUrl } = useGame();
  if (!character) return null;

  return (
    <nav className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border/40 bg-background z-20">
      <div className="flex items-center gap-3">
        <Link to="/" className="font-display text-base font-medium tracking-widest text-foreground hover:opacity-80 transition-opacity">
          CASTERS
        </Link>
        <span className="text-border">|</span>
        <div className="flex items-center gap-2">
          <img
            src={getPortraitUrl(character.portraitIndex)}
            alt={character.name}
            className="w-7 h-7 rounded-full object-cover border border-border"
          />
          <span className="hidden sm:inline text-sm font-display text-foreground">{character.name}</span>
          <span className={`hidden md:inline text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${getFactionBgColor(character.faction)} ${getFactionColor(character.faction)}`}>
            {character.faction}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-foreground">{character.lum} <span className="text-muted-foreground">LUM</span></span>
          <span className="text-muted-foreground/30">·</span>
          <span className="text-foreground">{character.fgld} <span className="text-muted-foreground">FGLD</span></span>
        </div>

        <div className="flex items-center gap-1">
          <Link to="/inventory" className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Inventory">
            <Package className="h-4 w-4" />
          </Link>
          <Link to="/chronicle" className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Chronicle">
            <Scroll className="h-4 w-4" />
          </Link>
          <Link to="/chat" className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Chronicler">
            <MessageSquare className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
