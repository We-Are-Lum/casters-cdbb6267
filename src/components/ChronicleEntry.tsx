import { BookOpen, Swords, Globe, Users } from "lucide-react";
import type { ChronicleEntry as ChronicleEntryType } from "@/lib/mockData";

const TYPE_ICONS = {
  quest_announce: Swords,
  challenge_result: BookOpen,
  world_event: Globe,
  faction_shift: Users,
};

const TYPE_LABELS = {
  quest_announce: "Quest",
  challenge_result: "Challenge",
  world_event: "World Event",
  faction_shift: "Faction Shift",
};

interface Props {
  entry: ChronicleEntryType;
}

export default function ChronicleEntryCard({ entry }: Props) {
  const Icon = TYPE_ICONS[entry.type];
  const timeAgo = getTimeAgo(entry.timestamp);

  return (
    <div className="relative pl-8 pb-8 last:pb-0 group">
      {/* Timeline line */}
      <div className="absolute left-3 top-6 bottom-0 w-px bg-border group-last:hidden" />

      {/* Timeline dot */}
      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-secondary border border-gold/30 flex items-center justify-center">
        <Icon className="h-3 w-3 text-primary" />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-display tracking-widest text-primary uppercase">
            {TYPE_LABELS[entry.type]}
          </span>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>
        <h4 className="font-display text-base font-semibold text-foreground">{entry.title}</h4>
        <p className="text-sm text-secondary-foreground leading-relaxed">{entry.body}</p>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
