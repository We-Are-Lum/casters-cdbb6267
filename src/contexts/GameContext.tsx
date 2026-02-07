import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MOCK_QUESTS, type Faction, type LootBag, type LootItem, type Quest } from "@/lib/mockData";
import { CHARACTER_IMAGES } from "@/lib/characterImages";

// --- Types ---

export interface GameCharacter {
  id: string;
  name: string;
  faction: Faction;
  backstory: string;
  portraitIndex: number;
  reputation: number;
  reputationTags: string[];
  lum: number;
  fgld: number;
  lootBags: LootBag[];
}

export interface Stake {
  id: string;
  questId: string;
  challengeId: string;
  amount: number;
  token: "LUM" | "FGLD";
  prediction: string;
  timestamp: string;
}

export interface TradeOffer {
  id: string;
  fromCharacterId: string;
  toCharacterId: string;
  amount: number;
  token: "LUM" | "FGLD";
  message: string;
  status: "pending" | "accepted" | "rejected";
  timestamp: string;
}

interface GameState {
  character: GameCharacter | null;
  loading: boolean;
  quests: Quest[];
  activeQuest: Quest | null;
  stakes: Stake[];
  trades: TradeOffer[];
  otherCharacters: GameCharacter[];

  // Actions
  setActiveQuest: (quest: Quest) => void;
  stakeTokens: (questId: string, challengeId: string, amount: number, token: "LUM" | "FGLD", prediction: string) => boolean;
  sendTrade: (toCharacterId: string, amount: number, token: "LUM" | "FGLD", message: string) => boolean;
  buyLootBag: (cost: number, token: "LUM" | "FGLD") => LootBag | null;
  getPortraitUrl: (index: number) => string;
  getFarcasterIntentUrl: (text: string, hashtag: string) => string;
  selectCharacter: (char: { name: string; faction: Faction; backstory: string; role?: string; strengths?: string; weaknesses?: string; portraitIndex: number }) => Promise<string | null>;
}

const GameContext = createContext<GameState | null>(null);

// Mock other characters in the world
const MOCK_OTHER_CHARACTERS: GameCharacter[] = [
  { id: "npc_001", name: "Kael Duskwhisper", faction: "Obsidian Circle", backstory: "", portraitIndex: 3, reputation: 55, reputationTags: ["Cunning"], lum: 120, fgld: 45, lootBags: [] },
  { id: "npc_002", name: "Lyra Thornweave", faction: "Verdant Concord", backstory: "", portraitIndex: 7, reputation: 80, reputationTags: ["Trusted", "Steadfast"], lum: 200, fgld: 90, lootBags: [] },
  { id: "npc_003", name: "Doran Ashfell", faction: "Crimson Pact", backstory: "", portraitIndex: 12, reputation: 40, reputationTags: ["Opportunist"], lum: 60, fgld: 150, lootBags: [] },
  { id: "npc_004", name: "Sera Voidlight", faction: "Azure Synod", backstory: "", portraitIndex: 18, reputation: 90, reputationTags: ["Trusted", "Cunning"], lum: 180, fgld: 70, lootBags: [] },
  { id: "npc_005", name: "Grimm Ironclaw", faction: "Crimson Pact", backstory: "", portraitIndex: 22, reputation: 30, reputationTags: ["Unreliable"], lum: 40, fgld: 200, lootBags: [] },
];

const LOOT_ITEM_POOL: LootItem[] = [
  { id: "loot_01", name: "Scroll of Minor Accord", type: "scroll", rarity: "common", description: "Single-use. Adds weight to a diplomatic action." },
  { id: "loot_02", name: "Ring of Fading", type: "ring", rarity: "uncommon", description: "The wearer's presence dims in crowded places." },
  { id: "loot_03", name: "Emberthorn Staff", type: "staff", rarity: "rare", description: "A staff that crackles with residual fire magic.", narrativePermission: "May invoke fire during Ashlands quests" },
  { id: "loot_04", name: "Starwhisper Fragment", type: "relic", rarity: "legendary", description: "A shard of the Archive itself. It hums with forbidden knowledge.", narrativePermission: "May decode any cipher once" },
  { id: "loot_05", name: "Shadow Veil", type: "ring", rarity: "uncommon", description: "Grants the ability to mask faction identity for one challenge." },
  { id: "loot_06", name: "Diplomat's Seal", type: "relic", rarity: "rare", description: "A seal recognized by all factions. Opens doors.", narrativePermission: "May initiate cross-faction trade without penalty" },
  { id: "loot_07", name: "Scroll of Rebuke", type: "scroll", rarity: "common", description: "Counters one opposing action in a challenge." },
  { id: "loot_08", name: "Voidstone Pendant", type: "relic", rarity: "legendary", description: "Absorbs one failed outcome and converts it into a twist.", narrativePermission: "May reroll one failure_fallout to failure_twist" },
];

function randomLootBag(): LootBag {
  const itemCount = Math.random() < 0.3 ? 2 : 1;
  const items: LootItem[] = [];
  const pool = [...LOOT_ITEM_POOL];

  for (let i = 0; i < itemCount && pool.length > 0; i++) {
    // Weighted random: common items more likely
    const weights = pool.map((item) => {
      switch (item.rarity) {
        case "common": return 4;
        case "uncommon": return 3;
        case "rare": return 2;
        case "legendary": return 1;
      }
    });
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let roll = Math.random() * totalWeight;
    let idx = 0;
    for (let w = 0; w < weights.length; w++) {
      roll -= weights[w];
      if (roll <= 0) { idx = w; break; }
    }
    const picked = pool.splice(idx, 1)[0];
    items.push({ ...picked, id: `${picked.id}_${Date.now()}_${i}` });
  }

  return {
    id: `bag_${Date.now()}`,
    opened: true,
    items,
  };
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [searchParams] = useSearchParams();
  const characterId = searchParams.get("character");

  const [character, setCharacter] = useState<GameCharacter | null>(null);
  const [loading, setLoading] = useState(true);
  const [stakes, setStakes] = useState<Stake[]>([]);
  const [trades, setTrades] = useState<TradeOffer[]>([]);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);

  // Load character from DB
  useEffect(() => {
    async function load() {
      if (!characterId) {
        // Fallback to mock
        setCharacter({
          id: "mock",
          name: "Aelindra Voss",
          faction: "Azure Synod",
          backstory: "A scholar of forbidden texts.",
          portraitIndex: 0,
          reputation: 72,
          reputationTags: ["Trusted", "Cunning"],
          lum: 100,
          fgld: 50,
          lootBags: [],
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("id", characterId)
        .single();

      if (error || !data) {
        console.error("Failed to load character:", error);
        setLoading(false);
        return;
      }

      setCharacter({
        id: data.id,
        name: data.name,
        faction: data.faction as Faction,
        backstory: data.backstory,
        portraitIndex: data.portrait_index,
        reputation: data.reputation_score,
        reputationTags: data.reputation_tags || [],
        lum: data.lum_balance,
        fgld: data.fgld_balance,
        lootBags: [],
      });
      setLoading(false);
    }
    load();
  }, [characterId]);

  // Auto-select first active quest
  useEffect(() => {
    if (!activeQuest) {
      const first = MOCK_QUESTS.find((q) => q.status === "active");
      if (first) setActiveQuest(first);
    }
  }, [activeQuest]);

  const stakeTokens = useCallback(
    (questId: string, challengeId: string, amount: number, token: "LUM" | "FGLD", prediction: string): boolean => {
      if (!character) return false;
      const balance = token === "LUM" ? character.lum : character.fgld;
      if (amount <= 0 || amount > balance) return false;

      setCharacter((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          lum: token === "LUM" ? prev.lum - amount : prev.lum,
          fgld: token === "FGLD" ? prev.fgld - amount : prev.fgld,
        };
      });

      setStakes((prev) => [
        ...prev,
        { id: `stake_${Date.now()}`, questId, challengeId, amount, token, prediction, timestamp: new Date().toISOString() },
      ]);
      return true;
    },
    [character]
  );

  const sendTrade = useCallback(
    (toCharacterId: string, amount: number, token: "LUM" | "FGLD", message: string): boolean => {
      if (!character) return false;
      const balance = token === "LUM" ? character.lum : character.fgld;
      if (amount <= 0 || amount > balance) return false;

      setCharacter((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          lum: token === "LUM" ? prev.lum - amount : prev.lum,
          fgld: token === "FGLD" ? prev.fgld - amount : prev.fgld,
        };
      });

      setTrades((prev) => [
        ...prev,
        {
          id: `trade_${Date.now()}`,
          fromCharacterId: character.id,
          toCharacterId,
          amount,
          token,
          message,
          status: "pending",
          timestamp: new Date().toISOString(),
        },
      ]);
      return true;
    },
    [character]
  );

  const buyLootBag = useCallback(
    (cost: number, token: "LUM" | "FGLD"): LootBag | null => {
      if (!character) return null;
      const balance = token === "LUM" ? character.lum : character.fgld;
      if (cost > balance) return null;

      const bag = randomLootBag();

      setCharacter((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          lum: token === "LUM" ? prev.lum - cost : prev.lum,
          fgld: token === "FGLD" ? prev.fgld - cost : prev.fgld,
          lootBags: [...prev.lootBags, bag],
        };
      });

      return bag;
    },
    [character]
  );

  const getPortraitUrl = useCallback((index: number) => {
    return CHARACTER_IMAGES[index] || CHARACTER_IMAGES[0];
  }, []);

  const getFarcasterIntentUrl = useCallback((text: string, hashtag: string) => {
    const fullText = `${text}\n\n${hashtag}`;
    return `https://warpcast.com/~/compose?text=${encodeURIComponent(fullText)}`;
  }, []);

  const selectCharacter = useCallback(async (char: { name: string; faction: Faction; backstory: string; role?: string; strengths?: string; weaknesses?: string; portraitIndex: number }): Promise<string | null> => {
    try {
      const { data, error: insertError } = await supabase
        .from("characters")
        .insert({
          name: char.name,
          faction: char.faction,
          backstory: char.backstory,
          portrait_index: char.portraitIndex,
          is_claimed: true,
        })
        .select("id")
        .single();

      if (insertError) throw insertError;

      setCharacter({
        id: data.id,
        name: char.name,
        faction: char.faction as Faction,
        backstory: char.backstory,
        portraitIndex: char.portraitIndex,
        reputation: 50,
        reputationTags: [],
        lum: 100,
        fgld: 50,
        lootBags: [],
      });

      return data.id;
    } catch (e) {
      console.error("Failed to save character:", e);
      return null;
    }
  }, []);

  return (
    <GameContext.Provider
      value={{
        character,
        loading,
        quests: MOCK_QUESTS,
        activeQuest,
        stakes,
        trades,
        otherCharacters: MOCK_OTHER_CHARACTERS,
        setActiveQuest,
        stakeTokens,
        sendTrade,
        buyLootBag,
        getPortraitUrl,
        getFarcasterIntentUrl,
        selectCharacter,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
