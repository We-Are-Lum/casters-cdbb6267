export type Faction = "Verdant Concord" | "Crimson Pact" | "Azure Synod" | "Obsidian Circle";

export type ReputationTag = "Trusted" | "Unreliable" | "Opportunist" | "Steadfast" | "Cunning" | "Unknown";

export interface Character {
  id: string;
  name: string;
  faction: Faction;
  reputation: number;
  reputationTags: ReputationTag[];
  lum: number;
  fgld: number;
  lootBags: LootBag[];
  walletAddress: string;
  createdAt: string;
}

export interface LootBag {
  id: string;
  opened: boolean;
  items: LootItem[];
}

export interface LootItem {
  id: string;
  name: string;
  type: "staff" | "ring" | "scroll" | "relic";
  rarity: "common" | "uncommon" | "rare" | "legendary";
  description: string;
  narrativePermission?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  challenges: Challenge[];
  status: "active" | "completed" | "failed";
  region: string;
  factionsInvolved: Faction[];
  startedAt: string;
  endsAt: string;
}

export interface Challenge {
  id: string;
  order: number;
  prompt: string;
  requiredHashtag: string;
  optionalActions: string[];
  status: "pending" | "active" | "resolved";
  deadline: string;
  outcome?: ChallengeOutcome;
}

export type ChallengeOutcome = "clean_success" | "messy_success" | "failure_fallout" | "failure_twist";

export interface ChronicleEntry {
  id: string;
  timestamp: string;
  type: "quest_announce" | "challenge_result" | "world_event" | "faction_shift";
  title: string;
  body: string;
  relatedQuestId?: string;
}

export interface Region {
  id: string;
  name: string;
  description: string;
  controllingFaction: Faction | null;
  stability: number;
}

// --- MOCK DATA ---

export const FACTIONS: { name: Faction; color: string; motto: string; goal: string }[] = [
  { name: "Verdant Concord", color: "faction-verdant", motto: "Growth through unity", goal: "Restore the Wildlands and expand the Green Reach across all regions" },
  { name: "Crimson Pact", color: "faction-crimson", motto: "Power demands sacrifice", goal: "Claim the Forge Eternal and rewrite the laws of magic" },
  { name: "Azure Synod", color: "faction-azure", motto: "Knowledge is the only currency", goal: "Decode the Starwhisper Archive and unlock forbidden truths" },
  { name: "Obsidian Circle", color: "faction-obsidian", motto: "In shadow, sovereignty", goal: "Undermine all factions and establish a new order from chaos" },
];

export const MOCK_CHARACTER: Character = {
  id: "char_001",
  name: "Aelindra Voss",
  faction: "Azure Synod",
  reputation: 72,
  reputationTags: ["Trusted", "Cunning"],
  lum: 85,
  fgld: 32,
  lootBags: [
    {
      id: "bag_001",
      opened: true,
      items: [
        { id: "item_001", name: "Whisperstaff of Tides", type: "staff", rarity: "rare", description: "A staff carved from driftwood that hums with oceanic resonance.", narrativePermission: "May commune with water spirits during coastal quests" },
        { id: "item_002", name: "Ring of Fading", type: "ring", rarity: "uncommon", description: "The wearer's presence dims in crowded places." },
        { id: "item_003", name: "Scroll of Minor Accord", type: "scroll", rarity: "common", description: "Single-use. Adds weight to a diplomatic action." },
      ],
    },
  ],
  walletAddress: "0x1a2b...9f3e",
  createdAt: "2025-12-01T00:00:00Z",
};

export const MOCK_QUESTS: Quest[] = [
  {
    id: "quest_001",
    title: "The Siege of Ember Gate",
    description: "The ancient Ember Gate has begun to fracture. The Crimson Pact seeks to harness its power while the Verdant Concord races to seal it. The fate of the Ashlands hangs in the balance.",
    region: "The Ashlands",
    factionsInvolved: ["Crimson Pact", "Verdant Concord"],
    status: "active",
    startedAt: "2026-02-04T12:00:00Z",
    endsAt: "2026-02-09T12:00:00Z",
    challenges: [
      {
        id: "ch_001",
        order: 1,
        prompt: "The Chronicler speaks: \"The Ember Gate groans. Its keepers have fallen silent. Who among you will declare your intent—to seal or to shatter? Post your allegiance. The world is watching.\"",
        requiredHashtag: "#EmberGateRises",
        optionalActions: ["Stake 10 $LUM to amplify your voice", "Use a Scroll to bolster faction diplomacy"],
        status: "active",
        deadline: "2026-02-06T12:00:00Z",
      },
      {
        id: "ch_002",
        order: 2,
        prompt: "The Chronicler speaks: \"The first cracks widen. Factions have spoken, but words alone cannot hold the gate. Rally your allies—or turn on them.\"",
        requiredHashtag: "#EmberGateHolds",
        optionalActions: ["Spend 15 $FGLD to fund reinforcements", "Use a Relic to unlock a hidden passage"],
        status: "pending",
        deadline: "2026-02-08T12:00:00Z",
      },
    ],
  },
  {
    id: "quest_002",
    title: "Whispers in the Starwhisper Archive",
    description: "Strange transmissions echo from the buried Archive. The Azure Synod deciphers fragments while the Obsidian Circle intercepts couriers. Something ancient stirs below.",
    region: "The Pale Reach",
    factionsInvolved: ["Azure Synod", "Obsidian Circle"],
    status: "active",
    startedAt: "2026-02-03T08:00:00Z",
    endsAt: "2026-02-08T08:00:00Z",
    challenges: [
      {
        id: "ch_003",
        order: 1,
        prompt: "The Chronicler speaks: \"A cipher has surfaced from the deep Archive. Those who solve it may unlock a truth long buried. But beware—some truths bite back.\"",
        requiredHashtag: "#StarwhisperRises",
        optionalActions: ["Stake 5 $LUM to access the cipher", "Use a Ring to mask your faction identity"],
        status: "resolved",
        deadline: "2026-02-05T08:00:00Z",
        outcome: "messy_success",
      },
      {
        id: "ch_004",
        order: 2,
        prompt: "The Chronicler speaks: \"The cipher cracked—but at a cost. A name was revealed: Valdris. Seek this name in public. Whoever surfaces it first will shape what comes next.\"",
        requiredHashtag: "#WhoIsValdris",
        optionalActions: ["Spend 10 $FGLD to bribe an informant"],
        status: "active",
        deadline: "2026-02-07T08:00:00Z",
      },
    ],
  },
];

export const MOCK_CHRONICLE: ChronicleEntry[] = [
  {
    id: "entry_001",
    timestamp: "2026-02-06T02:00:00Z",
    type: "challenge_result",
    title: "The First Cipher Falls",
    body: "The Azure Synod cracked the Starwhisper cipher, but not without cost. Three members broke ranks to share fragments with the Obsidian Circle. The Chronicler notes: trust is a currency that depreciates quickly in the Pale Reach. The name \"Valdris\" now echoes through every channel.",
    relatedQuestId: "quest_002",
  },
  {
    id: "entry_002",
    timestamp: "2026-02-05T18:00:00Z",
    type: "quest_announce",
    title: "The Ember Gate Awakens",
    body: "A tremor shook the Ashlands at dawn. The Ember Gate—sealed for three ages—has begun to glow. The Crimson Pact mobilized within hours. The Verdant Concord dispatched envoys. The Chronicler warns: this gate was not meant to be opened. But perhaps it was never truly closed.",
    relatedQuestId: "quest_001",
  },
  {
    id: "entry_003",
    timestamp: "2026-02-04T10:00:00Z",
    type: "faction_shift",
    title: "Obsidian Circle Gains Ground",
    body: "Through a series of quiet defections and well-placed bribes, the Obsidian Circle has extended influence into the Pale Reach. Their methods are subtle, their motives opaque. The balance shifts.",
  },
  {
    id: "entry_004",
    timestamp: "2026-02-03T06:00:00Z",
    type: "world_event",
    title: "The Moon Turned Amber",
    body: "For reasons the Chronicler cannot yet explain, the moon cast an amber light across all regions last night. Crops in the Green Reach grew an inch. Fires in the Ashlands burned hotter. This is not a metaphor. Something has changed.",
  },
];

export const MOCK_REGIONS: Region[] = [
  { id: "region_001", name: "The Ashlands", description: "A scorched expanse where the Ember Gate stands, contested by fire and will.", controllingFaction: "Crimson Pact", stability: 35 },
  { id: "region_002", name: "The Pale Reach", description: "A frozen archive of forbidden knowledge, buried beneath endless white.", controllingFaction: "Azure Synod", stability: 60 },
  { id: "region_003", name: "The Green Reach", description: "Fertile lands where the Verdant Concord nurtures life and alliance.", controllingFaction: "Verdant Concord", stability: 80 },
  { id: "region_004", name: "The Underhallow", description: "A network of tunnels and shadows where the Obsidian Circle whispers.", controllingFaction: "Obsidian Circle", stability: 45 },
];

export function getFactionColor(faction: Faction): string {
  switch (faction) {
    case "Verdant Concord": return "text-faction-verdant";
    case "Crimson Pact": return "text-faction-crimson";
    case "Azure Synod": return "text-faction-azure";
    case "Obsidian Circle": return "text-faction-obsidian";
  }
}

export function getFactionBgColor(faction: Faction): string {
  switch (faction) {
    case "Verdant Concord": return "bg-faction-verdant/20";
    case "Crimson Pact": return "bg-faction-crimson/20";
    case "Azure Synod": return "bg-faction-azure/20";
    case "Obsidian Circle": return "bg-faction-obsidian/20";
  }
}

export function getRarityColor(rarity: LootItem["rarity"]): string {
  switch (rarity) {
    case "common": return "text-muted-foreground";
    case "uncommon": return "text-faction-verdant";
    case "rare": return "text-faction-azure";
    case "legendary": return "text-primary";
  }
}
