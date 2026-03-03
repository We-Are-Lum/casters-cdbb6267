import { useState } from "react";
import { User, Package, ArrowRightLeft, ExternalLink, ChevronLeft, ChevronRight, X, Coins, ShoppingBag, Menu, MessageCircle, Sparkles, Stamp, Info } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGame } from "@/contexts/GameContext";
import { getFactionColor, getFactionBgColor, MOCK_CHARACTER } from "@/lib/mockData";
import InventoryPanel from "@/components/InventoryPanel";
import TradeDialog from "@/components/TradeDialog";
import StakeDialog from "@/components/StakeDialog";
import LootShop from "@/components/LootShop";
import FarcasterCompose from "@/components/FarcasterCompose";
import SidebarChat from "@/components/SidebarChat";
import MintCharacterDialog from "@/components/MintCharacterDialog";
import OnchainStampDialog from "@/components/OnchainStampDialog";
import CharacterInfoSheet from "@/components/CharacterInfoSheet";

type Tab = "aelia" | "character" | "inventory" | "transact" | "cast";

export default function GameSidebar() {
  const { character, getPortraitUrl, activeQuest } = useGame();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("aelia");
  const [tradeOpen, setTradeOpen] = useState(false);
  const [stakeOpen, setStakeOpen] = useState(false);
  const [lootOpen, setLootOpen] = useState(false);
  const [castOpen, setCastOpen] = useState(false);
  const [mintOpen, setMintOpen] = useState(false);
  const [stampOpen, setStampOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "aelia", label: "Aelia", icon: MessageCircle },
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
      {/* Floating toggle button — always visible when closed */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-4 top-4 z-40 bg-background border border-border p-2.5 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>
      )}

      {/* Mobile: full-screen overlay / Desktop: side panel */}
      {open && isMobile && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      <div
        className={`${
          isMobile
            ? `fixed inset-0 z-50 bg-background flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`
            : `h-full border-l border-border bg-background flex flex-col transition-all duration-300 ease-in-out ${open ? "w-80 lg:w-96" : "w-0 overflow-hidden"}`
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
          <div className="flex items-center shrink-0 ml-2">
            <ThemeToggle />
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label="Close sidebar"
            >
              {isMobile ? <X className="h-5 w-5" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Back to story button — mobile only */}
        {isMobile && (
          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-display tracking-widest uppercase text-muted-foreground hover:text-foreground border-b border-border/40 transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to Story
          </button>
        )}

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
        <div className={`flex-1 overflow-y-auto p-4 ${tab === "aelia" ? "" : "space-y-4"}`}>
          {tab === "aelia" && (
            <SidebarChat />
          )}

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

              {/* Onchain actions */}
              <div className="space-y-2 border-t border-border/40 pt-4">
                <span className="text-[10px] font-display tracking-widest text-muted-foreground uppercase">Onchain</span>
                <button
                  onClick={() => setMintOpen(true)}
                  className="w-full flex items-center gap-3 p-3 border border-border hover:border-foreground/30 transition-all text-left"
                >
                  <Sparkles className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <span className="text-xs font-display text-foreground block">Mint Character</span>
                    <span className="text-[10px] text-muted-foreground">Save permanently as NFT on Base</span>
                  </div>
                </button>
                <button
                  onClick={() => setStampOpen(true)}
                  className="w-full flex items-center gap-3 p-3 border border-border hover:border-foreground/30 transition-all text-left"
                >
                  <Stamp className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <span className="text-xs font-display text-foreground block">Stamp State</span>
                    <span className="text-[10px] text-muted-foreground">Snapshot current state onchain</span>
                  </div>
                </button>
              </div>

              {/* Info link */}
              <button
                onClick={() => setInfoOpen(true)}
                className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 hover:text-foreground transition-colors"
              >
                <Info className="h-3 w-3" />
                How characters work
              </button>
            </div>
          )}

          {tab === "character" && !character && (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-border/60 mx-auto flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground/40" />
                </div>
                <p className="text-xs text-muted-foreground">
                  No character yet. Speak to Aelia in the main story to discover who you are.
                </p>
              </div>

              <button
                onClick={() => setInfoOpen(true)}
                className="w-full flex items-center gap-3 p-3 border border-border hover:border-foreground/30 transition-all text-left"
              >
                <Info className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-xs font-display text-foreground block">How Characters Work</span>
                  <span className="text-[10px] text-muted-foreground">Minting, stamping, and lore eligibility</span>
                </div>
              </button>
            </div>
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
      <MintCharacterDialog open={mintOpen} onClose={() => setMintOpen(false)} />
      <OnchainStampDialog open={stampOpen} onClose={() => setStampOpen(false)} type="character" />
      <CharacterInfoSheet open={infoOpen} onClose={() => setInfoOpen(false)} />
    </>
  );
}
