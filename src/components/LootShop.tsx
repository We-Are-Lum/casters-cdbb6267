import { useState } from "react";
import { X, ShoppingBag, Sparkles, Package } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { getRarityColor, type LootBag } from "@/lib/mockData";
import { toast } from "@/hooks/use-toast";

const LOOT_TIERS = [
  { label: "Common Bag", cost: 25, token: "LUM" as const, description: "1–2 items, mostly common/uncommon" },
  { label: "Rare Bag", cost: 15, token: "FGLD" as const, description: "1–2 items, better odds for rare+" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function LootShop({ open, onClose }: Props) {
  const { character, buyLootBag } = useGame();
  const [lastBag, setLastBag] = useState<LootBag | null>(null);

  if (!open || !character) return null;

  const handleBuy = (cost: number, token: "LUM" | "FGLD") => {
    const balance = token === "LUM" ? character.lum : character.fgld;
    if (cost > balance) {
      toast({ title: "Insufficient funds", description: `You need ${cost} ${token} but have ${balance}.`, variant: "destructive" });
      return;
    }
    const bag = buyLootBag(cost, token);
    if (bag) {
      setLastBag(bag);
      toast({ title: "Loot bag acquired!", description: `You found ${bag.items.length} item(s).` });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-background border border-border w-full max-w-md mx-4 p-6 space-y-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-foreground" />
            <h2 className="font-display text-sm tracking-widest uppercase">Loot Bags</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>

        <p className="text-xs text-muted-foreground">Acquire items that grant narrative permissions and tactical advantages.</p>

        {/* Buy options */}
        <div className="space-y-3">
          {LOOT_TIERS.map((tier) => {
            const balance = tier.token === "LUM" ? character.lum : character.fgld;
            const canAfford = balance >= tier.cost;
            return (
              <button
                key={tier.label}
                onClick={() => handleBuy(tier.cost, tier.token)}
                disabled={!canAfford}
                className={`w-full flex items-center justify-between p-4 border transition-all text-left ${
                  canAfford ? "border-border hover:border-foreground/30" : "border-border/50 opacity-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <span className="text-sm font-display text-foreground block">{tier.label}</span>
                    <span className="text-[10px] text-muted-foreground">{tier.description}</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-foreground whitespace-nowrap">{tier.cost} {tier.token}</span>
              </button>
            );
          })}
        </div>

        {/* Last opened bag */}
        {lastBag && (
          <div className="space-y-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-gold" />
              <span className="text-[10px] font-display tracking-widest text-muted-foreground uppercase">Last Acquired</span>
            </div>
            {lastBag.items.map((item) => (
              <div key={item.id} className="p-3 border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                  <span className={`text-[10px] uppercase tracking-wider ${getRarityColor(item.rarity)}`}>{item.rarity}</span>
                </div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
                {item.narrativePermission && (
                  <p className="text-[10px] text-gold italic">⚡ {item.narrativePermission}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Inventory count */}
        <div className="text-[10px] text-muted-foreground text-center pt-2">
          You own {character.lootBags.length} bag(s) with {character.lootBags.flatMap((b) => b.items).length} total item(s)
        </div>
      </div>
    </div>
  );
}
