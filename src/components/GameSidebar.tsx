import { useState } from "react";
import { User, Package, ArrowRightLeft, ExternalLink, ChevronLeft, ChevronRight, Coins, ShoppingBag } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { getFactionColor, getFactionBgColor, MOCK_CHARACTER } from "@/lib/mockData";
import InventoryPanel from "@/components/InventoryPanel";
import TradeDialog from "@/components/TradeDialog";
import StakeDialog from "@/components/StakeDialog";
import LootShop from "@/components/LootShop";
import FarcasterCompose from "@/components/FarcasterCompose";

type Tab = "character" | "inventory" | "transact" | "cast";

export default function GameSidebar() {
  const { character, getPortraitUrl, activeQuest } = useGame();
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState<Tab>("character");
  const [tradeOpen, setTradeOpen] = useState(false);
  const [stakeOpen, setStakeOpen] = useState(false);
  const [lootOpen, setLootOpen] = useState(false);
  const [castOpen, setCastOpen] = useState(false);

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "character", label: "Character", icon: User },
    { id: "inventory", label: "Items", icon: Package },
    { id: "transact", label: "Transact", icon: ArrowRightLeft },
    { id: "cast", label: "Cast", icon: ExternalLink },
  ];

  // Build an inventory-compatible character object
  const displayChar = character
    ? {
        ...MOCK_CHARACTER,
        id: character.id,
        name: character.name,
        faction: character.faction,
        reputation: character.reputation,
        reputationTags: character.reputationTags as any,
        lum: character.lum,
        fgld: character.fgld,
        lootBags: character.lootBags,
      }
    : MOCK_CHARACTER;

  return (
    <>
      {/* Collapsed toggle */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-background border border-border border-r-0 p-2.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      {/* Sidebar panel */}
      <div
        className={`h-full border-l border-border bg-background flex flex-col transition-all duration-300 ease-in-out ${
          open ? "w-80 lg:w-96" : "w-0 overflow-hidden"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 shrink-0">
          {character ? (
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={getPortraitUrl(character.portraitIndex)}
                alt={character.name}
                className="w-6 h-6 rounded-full object-cover border border-border shrink-0"
              />
              <span className="text-xs font-display text-foreground truncate">{character.name}</span>
              <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 shrink-0 ${getFactionBgColor(character.faction)} ${getFactionColor(character.faction)}`}>
                {character.faction}
              </span>
            </div>
          ) : (
            <span className="text-xs font-display tracking-widest text-muted-foreground uppercase">
              No Character
            </span>
          )}
          <button
            onClick={() => setOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-2"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Balances bar */}
        {character && (
          <div className="flex items-center justify-center gap-4 px-4 py-2 border-b border-border/40 text-xs font-mono shrink-0">
            <span className="text-foreground">{character.lum} <span className="text-muted-foreground">LUM</span></span>
            <span className="text-muted-foreground/30">·</span>
            <span className="text-foreground">{character.fgld} <span className="text-muted-foreground">FGLD</span></span>
          </div>
        )}

        {/* Tab bar */}
        <div className="flex border-b border-border/40 shrink-0">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors ${
                tab === id
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="text-[9px] tracking-widest uppercase">{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {tab === "character" && character && (
            <div className="space-y-5">
              {/* Portrait + info */}
              <div className="flex flex-col items-center text-center space-y-3">
                <img
                  src={getPortraitUrl(character.portraitIndex)}
                  alt={character.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-border"
                />
                <div>
                  <h3 className="font-display text-base font-medium text-foreground">{character.name}</h3>
                  <span className={`inline-block mt-1 text-[10px] uppercase tracking-wider px-2 py-0.5 ${getFactionBgColor(character.faction)} ${getFactionColor(character.faction)}`}>
                    {character.faction}
                  </span>
                </div>
              </div>

              {/* Reputation */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-display tracking-widest text-muted-foreground uppercase">Reputation</span>
                  <span className="text-xs font-mono text-foreground">{character.reputation}/100</span>
                </div>
                <div className="h-1 bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-foreground transition-all"
                    style={{ width: `${character.reputation}%` }}
                  />
                </div>
                {character.reputationTags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {character.reputationTags.map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 bg-secondary text-secondary-foreground font-display">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Backstory */}
              <div className="space-y-1">
                <span className="text-[10px] font-display tracking-widest text-muted-foreground uppercase">Backstory</span>
                <p className="text-xs text-muted-foreground leading-relaxed font-serif italic">
                  "{character.backstory}"
                </p>
              </div>
            </div>
          )}

          {tab === "character" && !character && (
            <p className="text-xs text-muted-foreground italic text-center py-8">
              Chat with Aelia to choose your character.
            </p>
          )}

          {tab === "inventory" && (
            <InventoryPanel character={displayChar} />
          )}

          {tab === "transact" && (
            <div className="space-y-3">
              <button
                onClick={() => setStakeOpen(true)}
                disabled={!character}
                className="w-full flex items-center gap-3 p-4 border border-border hover:border-foreground/30 transition-all text-left disabled:opacity-30"
              >
                <Coins className="h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-sm font-display text-foreground block">Stake Tokens</span>
                  <span className="text-[10px] text-muted-foreground">Predict outcomes, risk your $LUM or $FGLD</span>
                </div>
              </button>
              <button
                onClick={() => setTradeOpen(true)}
                disabled={!character}
                className="w-full flex items-center gap-3 p-4 border border-border hover:border-foreground/30 transition-all text-left disabled:opacity-30"
              >
                <ArrowRightLeft className="h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-sm font-display text-foreground block">Trade</span>
                  <span className="text-[10px] text-muted-foreground">Send tokens to forge alliances or settle debts</span>
                </div>
              </button>
              <button
                onClick={() => setLootOpen(true)}
                disabled={!character}
                className="w-full flex items-center gap-3 p-4 border border-border hover:border-foreground/30 transition-all text-left disabled:opacity-30"
              >
                <ShoppingBag className="h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-sm font-display text-foreground block">Loot Bags</span>
                  <span className="text-[10px] text-muted-foreground">Acquire items with narrative permissions</span>
                </div>
              </button>
            </div>
          )}

          {tab === "cast" && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Draft and post to Farcaster. Your casts with quest hashtags are tracked by Aelia.
              </p>
              {activeQuest ? (
                <button
                  onClick={() => setCastOpen(true)}
                  disabled={!character}
                  className="w-full flex items-center gap-3 p-4 border border-border hover:border-foreground/30 transition-all text-left disabled:opacity-30"
                >
                  <ExternalLink className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div>
                    <span className="text-sm font-display text-foreground block">Post about {activeQuest.title}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{activeQuest.challenges[0]?.requiredHashtag || "#Casters"}</span>
                  </div>
                </button>
              ) : (
                <p className="text-xs text-muted-foreground italic text-center py-4">
                  No active quest to post about.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <TradeDialog open={tradeOpen} onClose={() => setTradeOpen(false)} />
      {activeQuest && (
        <StakeDialog
          open={stakeOpen}
          onClose={() => setStakeOpen(false)}
          challenge={activeQuest.challenges[0] || null}
          questId={activeQuest.id}
        />
      )}
      <LootShop open={lootOpen} onClose={() => setLootOpen(false)} />
      {activeQuest && (
        <FarcasterCompose
          open={castOpen}
          onClose={() => setCastOpen(false)}
          hashtag={activeQuest.challenges[0]?.requiredHashtag || "#Casters"}
          questTitle={activeQuest.title}
        />
      )}
    </>
  );
}
