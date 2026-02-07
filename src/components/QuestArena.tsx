import { useState } from "react";
import { Clock, Hash, ExternalLink, Coins, ArrowRightLeft, ShoppingBag, Users } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { getFactionColor, getFactionBgColor } from "@/lib/mockData";
import CountdownTimer from "./CountdownTimer";
import StakeDialog from "./StakeDialog";
import TradeDialog from "./TradeDialog";
import LootShop from "./LootShop";
import FarcasterCompose from "./FarcasterCompose";

export default function QuestArena() {
  const { activeQuest, quests, setActiveQuest, character } = useGame();
  const [showStake, setShowStake] = useState(false);
  const [showTrade, setShowTrade] = useState(false);
  const [showLoot, setShowLoot] = useState(false);
  const [showFarcaster, setShowFarcaster] = useState(false);

  if (!activeQuest || !character) return null;

  const activeChallenge = activeQuest.challenges.find((c) => c.status === "active");
  const otherQuests = quests.filter((q) => q.id !== activeQuest.id && q.status === "active");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Quest selector tabs */}
        {quests.filter((q) => q.status === "active").length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {quests.filter((q) => q.status === "active").map((q) => (
              <button
                key={q.id}
                onClick={() => setActiveQuest(q)}
                className={`whitespace-nowrap text-xs font-display uppercase tracking-widest px-4 py-2 border transition-all ${
                  q.id === activeQuest.id
                    ? "border-foreground text-foreground bg-foreground/5"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {q.title}
              </button>
            ))}
          </div>
        )}

        {/* Quest header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-display tracking-widest uppercase">{activeQuest.region}</span>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <CountdownTimer deadline={activeQuest.endsAt} />
            </div>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-wide">
            {activeQuest.title}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{activeQuest.description}</p>
          <div className="flex gap-2">
            {activeQuest.factionsInvolved.map((f) => (
              <span key={f} className={`text-xs font-display tracking-wider px-3 py-1 rounded-full ${getFactionBgColor(f)} ${getFactionColor(f)}`}>
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Active Challenge — the main focus */}
        {activeChallenge && (
          <div className="border border-foreground/20 bg-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-display text-[10px] tracking-widest text-muted-foreground">CHALLENGE {activeChallenge.order}</span>
                <span className="text-[10px] px-2 py-0.5 bg-foreground text-background font-display tracking-widest">ACTIVE</span>
              </div>
              <CountdownTimer deadline={activeChallenge.deadline} />
            </div>

            <blockquote className="text-base text-foreground leading-relaxed italic border-l-2 border-foreground/20 pl-4">
              {activeChallenge.prompt}
            </blockquote>

            {/* Required hashtag */}
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-foreground" />
              <span className="font-mono text-sm font-semibold text-foreground">{activeChallenge.requiredHashtag}</span>
            </div>

            {/* === ACTION GRID === */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <ActionButton
                icon={<ExternalLink className="h-4 w-4" />}
                label="Post on Farcaster"
                sublabel={activeChallenge.requiredHashtag}
                onClick={() => setShowFarcaster(true)}
                accent
              />
              <ActionButton
                icon={<Coins className="h-4 w-4" />}
                label="Stake Tokens"
                sublabel={`${character.lum} LUM · ${character.fgld} FGLD`}
                onClick={() => setShowStake(true)}
              />
              <ActionButton
                icon={<ArrowRightLeft className="h-4 w-4" />}
                label="Trade"
                sublabel="Send to ally or rival"
                onClick={() => setShowTrade(true)}
              />
              <ActionButton
                icon={<ShoppingBag className="h-4 w-4" />}
                label="Buy Loot Bag"
                sublabel="25 LUM or 15 FGLD"
                onClick={() => setShowLoot(true)}
              />
            </div>
          </div>
        )}

        {/* Challenge progress */}
        <div className="space-y-3">
          <span className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">Quest Progress</span>
          <div className="flex gap-2">
            {activeQuest.challenges.map((c) => (
              <div key={c.id} className="flex-1 space-y-1">
                <div className={`h-1.5 rounded-full ${
                  c.status === "resolved" ? "bg-foreground" : c.status === "active" ? "bg-foreground/40 animate-pulse" : "bg-border"
                }`} />
                <span className="text-[10px] text-muted-foreground font-mono">Ch.{c.order}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Other characters in this quest */}
        <OtherCharactersPanel />

        {/* Dialogs */}
        <StakeDialog open={showStake} onClose={() => setShowStake(false)} challenge={activeChallenge || null} questId={activeQuest.id} />
        <TradeDialog open={showTrade} onClose={() => setShowTrade(false)} />
        <LootShop open={showLoot} onClose={() => setShowLoot(false)} />
        {activeChallenge && (
          <FarcasterCompose
            open={showFarcaster}
            onClose={() => setShowFarcaster(false)}
            hashtag={activeChallenge.requiredHashtag}
            questTitle={activeQuest.title}
          />
        )}
      </div>
    </div>
  );
}

function ActionButton({ icon, label, sublabel, onClick, accent }: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start gap-2 p-4 border transition-all text-left group ${
        accent
          ? "border-foreground bg-foreground/5 hover:bg-foreground/10"
          : "border-border hover:border-foreground/30 hover:bg-card"
      }`}
    >
      <span className={accent ? "text-foreground" : "text-muted-foreground group-hover:text-foreground transition-colors"}>
        {icon}
      </span>
      <div>
        <span className="text-xs font-display tracking-wider uppercase text-foreground block">{label}</span>
        <span className="text-[10px] text-muted-foreground">{sublabel}</span>
      </div>
    </button>
  );
}

function OtherCharactersPanel() {
  const { otherCharacters, getPortraitUrl } = useGame();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">Characters in the World</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {otherCharacters.map((c) => (
          <div key={c.id} className="flex items-center gap-3 p-3 border border-border hover:border-foreground/20 transition-colors">
            <img src={getPortraitUrl(c.portraitIndex)} alt={c.name} className="w-10 h-10 rounded-full object-cover border border-border" />
            <div className="min-w-0">
              <span className="text-sm font-display text-foreground block truncate">{c.name}</span>
              <span className={`text-[10px] font-display tracking-wider ${getFactionColor(c.faction)}`}>{c.faction}</span>
              <div className="flex gap-2 text-[10px] font-mono text-muted-foreground mt-0.5">
                <span>{c.lum} LUM</span>
                <span>{c.fgld} FGLD</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
