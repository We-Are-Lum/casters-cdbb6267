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
  role?: string;
  strengths?: string;
  weaknesses?: string;
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
  role: "Archivist",
  strengths: "Access to the Starwhisper Archive's outer vaults",
  weaknesses: "Distrusted by the Crimson Pact for past information leaks",
};

export const MOCK_QUESTS: Quest[] = [
  {
    id: "quest_001",
    title: "The Siege of Ember Gate",
    description: "The ancient Ember Gate has begun to fracture. The Crimson Pact seeks to harness its power while the Verdant Concord races to seal it. Both sides need allies — and both are willing to pay. Your faction stance matters, but so does your wallet. Staking $LUM here signals commitment. Silence signals cowardice.",
    region: "The Ashlands",
    factionsInvolved: ["Crimson Pact", "Verdant Concord"],
    status: "active",
    startedAt: "2026-02-04T12:00:00Z",
    endsAt: "2026-02-09T12:00:00Z",
    challenges: [
      {
        id: "ch_001",
        order: 1,
        prompt: "Aelia speaks: \"The Ember Gate groans. Its keepers have fallen silent. Who among you will declare your intent — to seal or to shatter? Post your allegiance on Farcaster. The world is watching. Those who stake $LUM amplify their voice. Those who stay silent will be remembered for that too.\"",
        requiredHashtag: "#EmberGateRises",
        optionalActions: [
          "Stake $LUM to amplify your faction's voice",
          "Trade $FGLD to a rival character to sway their allegiance",
          "Buy a loot bag — a Scroll of Accord could tip the balance",
        ],
        status: "active",
        deadline: "2026-02-06T12:00:00Z",
      },
      {
        id: "ch_002",
        order: 2,
        prompt: "Aelia speaks: \"The first cracks widen. Factions have spoken, but words alone cannot hold the gate. Rally your allies — or turn on them. Those who staked heavily in Challenge 1 now hold leverage. But leverage invites scrutiny.\"",
        requiredHashtag: "#EmberGateHolds",
        optionalActions: [
          "Spend $FGLD to fund reinforcements (visible to all)",
          "Use a Relic to unlock a hidden passage (narrative permission required)",
          "Form a cross-faction alliance by trading tokens",
        ],
        status: "pending",
        deadline: "2026-02-08T12:00:00Z",
      },
    ],
  },
  {
    id: "quest_002",
    title: "Whispers in the Starwhisper Archive",
    description: "Strange transmissions echo from the buried Archive. The Azure Synod deciphers fragments while the Obsidian Circle intercepts couriers. A name surfaced: Valdris. Whoever controls this name controls what comes next. Knowledge is currency here — and $FGLD buys informants.",
    region: "The Pale Reach",
    factionsInvolved: ["Azure Synod", "Obsidian Circle"],
    status: "active",
    startedAt: "2026-02-03T08:00:00Z",
    endsAt: "2026-02-08T08:00:00Z",
    challenges: [
      {
        id: "ch_003",
        order: 1,
        prompt: "Aelia speaks: \"A cipher has surfaced from the deep Archive. Those who solve it may unlock a truth long buried. But beware — some truths bite back. The Obsidian Circle has already placed agents. Will you outspend them, outthink them, or join them?\"",
        requiredHashtag: "#StarwhisperRises",
        optionalActions: [
          "Stake $LUM to access the cipher (commitment visible to rivals)",
          "Use a Ring to mask your faction identity during this challenge",
          "Trade information via Farcaster — what you reveal shapes what others know",
        ],
        status: "resolved",
        deadline: "2026-02-05T08:00:00Z",
        outcome: "messy_success",
      },
      {
        id: "ch_004",
        order: 2,
        prompt: "Aelia speaks: \"The cipher cracked — but at a cost. Three Synod members broke ranks to share fragments with the Obsidian Circle. The name 'Valdris' now echoes through every channel. Whoever surfaces it first on Farcaster shapes the narrative. $FGLD can buy silence or amplification.\"",
        requiredHashtag: "#WhoIsValdris",
        optionalActions: [
          "Spend $FGLD to bribe an informant (reveals hidden quest data)",
          "Post on Farcaster to claim the narrative before others do",
          "Stake $LUM on whether Valdris is ally or threat",
        ],
        status: "active",
        deadline: "2026-02-07T08:00:00Z",
      },
    ],
  },
  {
    id: "quest_003",
    title: "The Merchant's Dilemma",
    description: "A luminous item has appeared in a merchant's bag in the Lower Market. The glow is fading. All four factions want it. The merchant wants the highest bidder — but 'highest' doesn't always mean money. Reputation, protection, and public support all carry weight. This is a coordination problem disguised as an auction.",
    region: "The Lower Market",
    factionsInvolved: ["Verdant Concord", "Crimson Pact", "Azure Synod", "Obsidian Circle"],
    status: "active",
    startedAt: "2026-02-05T16:00:00Z",
    endsAt: "2026-02-07T16:00:00Z",
    challenges: [
      {
        id: "ch_005",
        order: 1,
        prompt: "Aelia speaks: \"A staff in Merchant Calloway's bag has begun to glow. She is no fool — she will sell to whoever offers the most convincing combination of coin, protection, and public endorsement. Post your bid on Farcaster. Pool $FGLD with allies if you dare. But remember: the glow fades at sunset.\"",
        requiredHashtag: "#LuminousBargain",
        optionalActions: [
          "Pool $FGLD with allies to make a joint bid (visible alliance)",
          "Stake $LUM to signal you'll protect the merchant after the sale",
          "Buy a loot bag — you might find a bargaining chip inside",
          "Undercut a rival's bid by posting a public challenge on Farcaster",
        ],
        status: "active",
        deadline: "2026-02-06T20:00:00Z",
      },
      {
        id: "ch_006",
        order: 2,
        prompt: "Aelia speaks: \"The bids are in. But the merchant hesitates. She's heard rumors — that the buyer intends to hoard, not share. She wants a public promise. Someone must stake their reputation. Who will speak first?\"",
        requiredHashtag: "#CallowayDecides",
        optionalActions: [
          "Stake $LUM as a public promise (binds your reputation)",
          "Trade $FGLD to the merchant directly",
          "Post a Farcaster thread defending your bid",
        ],
        status: "pending",
        deadline: "2026-02-07T12:00:00Z",
      },
    ],
  },
  {
    id: "quest_004",
    title: "The Warden's Silence",
    description: "Theron Ashguard, a respected Verdant Concord warden, has gone silent. His post at the Green Reach border was found abandoned. His loot bag is missing. Was it foul play, defection, or something worse? The Concord wants answers. The Obsidian Circle may already have them — for a price.",
    region: "The Green Reach",
    factionsInvolved: ["Verdant Concord", "Obsidian Circle"],
    status: "active",
    startedAt: "2026-02-06T06:00:00Z",
    endsAt: "2026-02-10T06:00:00Z",
    challenges: [
      {
        id: "ch_007",
        order: 1,
        prompt: "Aelia speaks: \"Theron's silence is three days old now. The Verdant Concord is rattled. The Obsidian Circle claims to know his location — but they want $FGLD, and they want it publicly. Do you pay the ransom in the open, or try to find him yourself? Every hour of delay is an hour the trail goes cold.\"",
        requiredHashtag: "#WardensWatch",
        optionalActions: [
          "Send $FGLD to the Obsidian Circle contact (visible transaction)",
          "Stake $LUM that Theron defected willingly (risky prediction)",
          "Post on Farcaster calling for information (crowd-source the search)",
          "Buy a loot bag — a Scroll of Rebuke could counter the Circle's leverage",
        ],
        status: "active",
        deadline: "2026-02-08T06:00:00Z",
      },
      {
        id: "ch_008",
        order: 2,
        prompt: "Aelia speaks: \"A fragment of Theron's journal surfaces. It mentions 'the temptation of keeping the bag.' Moloch whispers. Was Theron protecting the city, or protecting himself? The evidence is ambiguous. Your interpretation — posted publicly — will shape what the city believes happened.\"",
        requiredHashtag: "#TheronsTruth",
        optionalActions: [
          "Post your interpretation on Farcaster (shapes the official narrative)",
          "Stake $LUM on your version of events",
          "Trade $FGLD to allies who share your interpretation",
        ],
        status: "pending",
        deadline: "2026-02-09T18:00:00Z",
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
    id: "entry_005",
    timestamp: "2026-02-06T00:00:00Z",
    type: "quest_announce",
    title: "A Staff Glows in the Lower Market",
    body: "Merchant Calloway's bag has produced something remarkable — a staff that emits a faint, warm light. The luminosity is confirmed. All four factions have dispatched representatives. Calloway is accepting bids, but she is shrewd. She wants more than coin. She wants guarantees.",
    relatedQuestId: "quest_003",
  },
  {
    id: "entry_002",
    timestamp: "2026-02-05T18:00:00Z",
    type: "quest_announce",
    title: "The Ember Gate Awakens",
    body: "A tremor shook the Ashlands at dawn. The Ember Gate — sealed for three ages — has begun to glow. The Crimson Pact mobilized within hours. The Verdant Concord dispatched envoys. The Chronicler warns: this gate was not meant to be opened. But perhaps it was never truly closed.",
    relatedQuestId: "quest_001",
  },
  {
    id: "entry_006",
    timestamp: "2026-02-05T14:00:00Z",
    type: "world_event",
    title: "Warden Theron Goes Silent",
    body: "Three days without word from the Green Reach border post. Theron Ashguard's loot bag is missing. The Verdant Concord fears the worst. The Obsidian Circle, characteristically, claims to know more than they should.",
    relatedQuestId: "quest_004",
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
  { id: "region_005", name: "The Lower Market", description: "A bustling trade hub where all factions meet on neutral ground. Coin speaks louder than faction here.", controllingFaction: null, stability: 70 },
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
