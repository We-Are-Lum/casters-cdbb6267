import { Link } from "react-router-dom";
import { Swords, Clock } from "lucide-react";
import type { Quest } from "@/lib/mockData";
import { getFactionColor } from "@/lib/mockData";
import CountdownTimer from "./CountdownTimer";

interface QuestCardProps {
  quest: Quest;
}

export default function QuestCard({ quest }: QuestCardProps) {
  const activeChallenge = quest.challenges.find((c) => c.status === "active");
  const progress = quest.challenges.filter((c) => c.status === "resolved").length;
  const total = quest.challenges.length;

  return (
    <Link
      to={`/quest/${quest.id}`}
      className="group block gradient-card rounded-lg border border-border hover:border-gold/40 transition-all duration-300 overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Swords className="h-4 w-4 text-primary" />
            <span className="text-xs font-display tracking-widest text-muted-foreground uppercase">{quest.region}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <CountdownTimer deadline={quest.endsAt} />
          </div>
        </div>

        <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
          {quest.title}
        </h3>

        <p className="text-sm text-secondary-foreground leading-relaxed mb-4 line-clamp-2">
          {quest.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {quest.factionsInvolved.map((f) => (
              <span key={f} className={`text-xs font-display tracking-wider ${getFactionColor(f)}`}>
                {f}
              </span>
            ))}
          </div>

          {/* Progress pips */}
          <div className="flex gap-1">
            {quest.challenges.map((c, i) => (
              <div
                key={i}
                className={`h-2 w-6 rounded-full ${
                  c.status === "resolved"
                    ? "bg-primary"
                    : c.status === "active"
                    ? "bg-primary/40 animate-pulse-gold"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {activeChallenge && (
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground font-display tracking-wider mb-1">ACTIVE CHALLENGE</p>
            <p className="text-sm text-secondary-foreground italic line-clamp-2">
              "{activeChallenge.prompt.slice(0, 120)}..."
            </p>
            <span className="inline-block mt-2 text-xs font-mono text-primary">{activeChallenge.requiredHashtag}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
