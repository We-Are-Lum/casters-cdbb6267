import { Package, Sparkles } from "lucide-react";
import type { Character, LootItem } from "@/lib/mockData";
import { getRarityColor } from "@/lib/mockData";

const TYPE_EMOJI: Record<LootItem["type"], string> = {
  staff: "🪄",
  ring: "💍",
  scroll: "📜",
  relic: "🔮",
};

interface Props {
  character: Character;
}

export default function InventoryPanel({ character }: Props) {
  const allItems = character.lootBags.flatMap((b) => b.items);

  return (
    <div className="gradient-card rounded-lg border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Package className="h-4 w-4 text-primary" />
        <h3 className="font-display text-sm tracking-widest text-primary uppercase">Inventory</h3>
      </div>

      {/* Tokens */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-md bg-secondary p-3 text-center">
          <div className="text-lg font-mono font-bold text-primary">{character.lum}</div>
          <div className="text-xs text-muted-foreground font-display tracking-wider">$LUM</div>
        </div>
        <div className="rounded-md bg-secondary p-3 text-center">
          <div className="text-lg font-mono font-bold text-accent">{character.fgld}</div>
          <div className="text-xs text-muted-foreground font-display tracking-wider">$FGLD</div>
        </div>
      </div>

      {/* Loot Items */}
      <div className="space-y-2">
        {allItems.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-md bg-secondary/50 p-3 hover:bg-secondary transition-colors"
          >
            <span className="text-lg">{TYPE_EMOJI[item.type]}</span>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-semibold ${getRarityColor(item.rarity)}`}>
                {item.name}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
              {item.narrativePermission && (
                <div className="flex items-center gap-1 mt-1.5">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span className="text-xs text-primary italic">{item.narrativePermission}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Loot bags */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="text-xs font-display tracking-wider text-muted-foreground mb-2">LOOT BAGS</div>
        {character.lootBags.map((bag) => (
          <div key={bag.id} className="flex items-center gap-2 text-sm">
            <span>{bag.opened ? "📦" : "🎁"}</span>
            <span className="text-secondary-foreground">
              {bag.opened ? `Opened · ${bag.items.length} items` : "Sealed — ready to open"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
