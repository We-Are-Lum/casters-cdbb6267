import type { Character } from "@/lib/mockData";

interface Props {
  character: Character;
}

export default function InventoryPanel({ character }: Props) {
  const allItems = character.lootBags.flatMap((b) => b.items);

  return (
    <div className="border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xs tracking-widest text-foreground uppercase">
          Possessions
        </h3>
        <div className="flex gap-3 text-xs font-mono">
          <span>{character.lum} LUM</span>
          <span className="text-muted-foreground">|</span>
          <span>{character.fgld} FGLD</span>
        </div>
      </div>

      <div className="space-y-3">
        {allItems.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 border border-border/50 hover:border-foreground/30 transition-colors bg-background"
          >
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-medium text-foreground">{item.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {item.rarity}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}

        {allItems.length === 0 && (
          <p className="text-xs text-muted-foreground italic text-center py-4">
            Your inventory is empty.
          </p>
        )}
      </div>
    </div>
  );
}
