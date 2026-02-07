import { Link } from "react-router-dom";
import { ArrowRight, Coins, Users, MessageSquare, ExternalLink, ShoppingBag, Swords, Eye, Clock } from "lucide-react";

const sections = [
  {
    icon: <Users className="h-5 w-5" />,
    title: "You Are a Position, Not a Hero",
    body: "When you enter, you choose one of 30 characters. These are not warriors — they are guild affiliates, messengers, traders, fixers, archivists, wardens. Each has a social role in the city, people who trust them, people who don't, doors that open for them, and obligations that bind them. You cannot switch freely. Your reputation follows you.",
  },
  {
    icon: <Swords className="h-5 w-5" />,
    title: "The World Is Always Mid-Crisis",
    body: "There is no main quest. Instead, the city has active tensions — rumors of new loot bags, disputes between guilds, infrastructure failures, quiet power grabs. Several quests run simultaneously. You enter one already in motion. Other players may already be involved. You don't accept a quest in isolation — you step into a situation.",
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: "Chat Is Gameplay",
    body: "Most gameplay happens through conversation with the AI Chronicler. You speak, persuade, withhold, escalate, call in allies, or walk away. There is no option menu. Your words are the move. The Chronicler describes the situation, plays NPCs, tracks time pressure, and reacts differently based on your character, alliances, and past actions.",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Scarcity Creates Urgency",
    body: "Some moments are time-bound. When a loot item glows, the window is short. Other players may be notified. Delays matter. Indecision has consequences. The Chronicler will advance the world if you stall, resolve events if consensus fails, and remember who pushed for what.",
  },
  {
    icon: <Coins className="h-5 w-5" />,
    title: "$LUM — Stakes & Commitment",
    body: "Stake $LUM during key moments to signal seriousness, lock yourself into a position, and gain credibility. But staking is not always good. It can paint a target on you, tie your fate to an outcome, or anger rivals. Some quests require stake. Others become harder if you refuse.",
  },
  {
    icon: <Coins className="h-5 w-5" />,
    title: "$FGLD — Alliances & Influence",
    body: "Use $FGLD to form alliances, compensate collaborators, grease negotiations, and fund expeditions. Giving $FGLD is visible. People remember who paid — and who didn't. You can pool with allies, quietly fund factions, or publicly sponsor actions. Money talks, but it doesn't always persuade.",
  },
  {
    icon: <ShoppingBag className="h-5 w-5" />,
    title: "Loot Bags — The Core Mechanic",
    body: "Loot bags are scarce world objects. Most of the time, they are mundane. Occasionally, an item emits luminosity — the magic is active, action becomes urgent. Only one item glows at a time. The glow fades. No one owns the power. Possession doesn't equal control. Presence and coordination matter more than force. Using a glowing item often resolves one problem and creates new ones.",
  },
  {
    icon: <ExternalLink className="h-5 w-5" />,
    title: "Farcaster Is Part of the World",
    body: "Some actions require or trigger Farcaster posts — announcing discoveries, rallying support, leaking information, signaling allegiance, calling out rivals, recording 'official' history. The Chronicler may ask you to post. Public speech has consequences. Silence does too.",
  },
  {
    icon: <Eye className="h-5 w-5" />,
    title: "Beware the Pattern Called Moloch",
    body: "As you play, the game introduces temptations: hoard bags 'just in case,' act alone 'just this once,' narrow access 'for safety,' justify control as stability. This is Moloch — not a boss, but a pattern. The game does not punish you for embracing it. It shows you what it costs.",
  },
];

export default function HowToPlay() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        {/* Header */}
        <div className="space-y-6 mb-16">
          <Link
            to="/"
            className="text-xs font-display tracking-widest text-muted-foreground hover:text-foreground transition-colors uppercase"
          >
            ← Back
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
            How the Game Works
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            This is a persistent social RPG played through chat, Farcaster, and onchain actions.
            You are not grinding stats or fighting monsters. You are navigating alliances, scarcity,
            coordination, and temptation inside a living world.
          </p>
          <blockquote className="border-l-2 border-foreground/20 pl-4 text-sm text-muted-foreground italic">
            "Your actions matter. Other players are real. The story does not reset."
          </blockquote>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">{section.icon}</span>
                <h2 className="font-display text-lg font-medium tracking-wide">{section.title}</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-8">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* What Winning Means */}
        <div className="mt-16 pt-8 border-t border-border space-y-4">
          <h2 className="font-display text-lg font-medium tracking-wide">What Winning Means</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            There is no universal win condition. You might hold influence without authority,
            build systems that outlast you, secure wealth at the cost of trust, keep the city
            stable longer than expected, accelerate fracture and profit from it, or become a
            cautionary tale. The game measures success in impact, not survival.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-center gap-6">
          <Link
            to="/choose"
            className="group inline-flex items-center gap-3 px-8 py-4 text-sm font-display uppercase tracking-widest text-foreground border border-foreground/20 hover:border-foreground transition-all bg-background/50"
          >
            Choose Your Character
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="text-xs text-muted-foreground/60 italic">
            "The most dangerous move is the one that feels reasonable at the time."
          </p>
        </div>
      </div>
    </div>
  );
}
