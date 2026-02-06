import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Hash, Sparkles, CheckCircle, AlertTriangle, XCircle, Zap } from "lucide-react";
import { MOCK_QUESTS } from "@/lib/mockData";
import { getFactionColor, getFactionBgColor } from "@/lib/mockData";
import Navbar from "@/components/Navbar";
import CountdownTimer from "@/components/CountdownTimer";
import type { ChallengeOutcome } from "@/lib/mockData";

const OUTCOME_DISPLAY: Record<ChallengeOutcome, { icon: typeof CheckCircle; label: string; className: string }> = {
  clean_success: { icon: CheckCircle, label: "Clean Success", className: "text-faction-verdant" },
  messy_success: { icon: AlertTriangle, label: "Messy Success", className: "text-primary" },
  failure_fallout: { icon: XCircle, label: "Failure with Fallout", className: "text-destructive" },
  failure_twist: { icon: Zap, label: "Failure with Twist", className: "text-accent" },
};

export default function QuestDetail() {
  const { questId } = useParams();
  const quest = MOCK_QUESTS.find((q) => q.id === questId);

  if (!quest) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl text-foreground">Quest not found</h1>
          <Link to="/dashboard" className="text-primary mt-4 inline-block">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 max-w-3xl">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Quests
        </Link>

        {/* Quest header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-display tracking-widest text-muted-foreground uppercase">{quest.region}</span>
            <span className="text-muted-foreground">·</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <CountdownTimer deadline={quest.endsAt} />
            </div>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-wide mb-3 glow-text-gold">
            {quest.title}
          </h1>

          <p className="text-base text-secondary-foreground leading-relaxed mb-4">{quest.description}</p>

          <div className="flex gap-2">
            {quest.factionsInvolved.map((f) => (
              <span key={f} className={`text-xs font-display tracking-wider px-3 py-1 rounded-full ${getFactionBgColor(f)} ${getFactionColor(f)}`}>
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Challenges */}
        <div className="space-y-6">
          <h2 className="font-display text-xs tracking-[0.3em] text-primary uppercase">Challenges</h2>

          {quest.challenges.map((challenge) => {
            const outcomeInfo = challenge.outcome ? OUTCOME_DISPLAY[challenge.outcome] : null;
            const OutcomeIcon = outcomeInfo?.icon;

            return (
              <div
                key={challenge.id}
                className={`rounded-lg border p-6 transition-all ${
                  challenge.status === "active"
                    ? "border-gold/50 glow-gold gradient-card"
                    : challenge.status === "resolved"
                    ? "border-border bg-card/50"
                    : "border-border/50 bg-card/30 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-xs tracking-widest text-muted-foreground">
                      CHALLENGE {challenge.order}
                    </span>
                    {challenge.status === "active" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-display animate-pulse-gold">
                        ACTIVE
                      </span>
                    )}
                    {challenge.status === "resolved" && outcomeInfo && OutcomeIcon && (
                      <span className={`flex items-center gap-1 text-xs ${outcomeInfo.className}`}>
                        <OutcomeIcon className="h-3.5 w-3.5" />
                        {outcomeInfo.label}
                      </span>
                    )}
                  </div>
                  {challenge.status !== "resolved" && (
                    <CountdownTimer deadline={challenge.deadline} />
                  )}
                </div>

                {/* Prompt */}
                <blockquote className="text-base text-foreground leading-relaxed italic border-l-2 border-gold/30 pl-4 mb-4">
                  {challenge.prompt}
                </blockquote>

                {/* Required action */}
                <div className="flex items-center gap-2 mb-3">
                  <Hash className="h-4 w-4 text-primary" />
                  <span className="font-mono text-sm text-primary font-semibold">{challenge.requiredHashtag}</span>
                  <span className="text-xs text-muted-foreground">— Post on Farcaster to participate</span>
                </div>

                {/* Optional actions */}
                {challenge.optionalActions.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-display tracking-wider text-muted-foreground">OPTIONAL ACTIONS</span>
                    {challenge.optionalActions.map((action, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-secondary-foreground">
                        <Sparkles className="h-3 w-3 text-accent" />
                        {action}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
