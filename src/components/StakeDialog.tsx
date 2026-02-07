import { useState } from "react";
import { X, Coins, TrendingUp } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import type { Challenge } from "@/lib/mockData";
import { toast } from "@/hooks/use-toast";

const PREDICTIONS = [
  { id: "clean_success", label: "Clean Success", description: "The faction resolves this flawlessly" },
  { id: "messy_success", label: "Messy Success", description: "Success, but with complications" },
  { id: "failure_twist", label: "Failure with Twist", description: "It fails, but something unexpected happens" },
  { id: "failure_fallout", label: "Total Failure", description: "It collapses completely" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  challenge: Challenge | null;
  questId: string;
}

export default function StakeDialog({ open, onClose, challenge, questId }: Props) {
  const { character, stakeTokens, stakes } = useGame();
  const [amount, setAmount] = useState(10);
  const [token, setToken] = useState<"LUM" | "FGLD">("LUM");
  const [prediction, setPrediction] = useState<string>("");

  if (!open || !challenge || !character) return null;

  const balance = token === "LUM" ? character.lum : character.fgld;
  const existingStakes = stakes.filter((s) => s.challengeId === challenge.id);

  const handleStake = () => {
    if (!prediction) {
      toast({ title: "Choose a prediction", description: "You must predict an outcome to stake.", variant: "destructive" });
      return;
    }
    if (amount <= 0 || amount > balance) {
      toast({ title: "Invalid amount", description: `You have ${balance} ${token}.`, variant: "destructive" });
      return;
    }

    const success = stakeTokens(questId, challenge.id, amount, token, prediction);
    if (success) {
      toast({ title: "Stake placed!", description: `${amount} ${token} on ${PREDICTIONS.find((p) => p.id === prediction)?.label}` });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-background border border-border w-full max-w-md mx-4 p-6 space-y-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-foreground" />
            <h2 className="font-display text-sm tracking-widest uppercase">Stake Tokens</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>

        <p className="text-xs text-muted-foreground">Predict the outcome of Challenge {challenge.order}. If you're right, you win the pot.</p>

        {/* Prediction selection */}
        <div className="space-y-2">
          <span className="text-[10px] font-display tracking-widest text-muted-foreground uppercase">Your Prediction</span>
          <div className="grid grid-cols-2 gap-2">
            {PREDICTIONS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPrediction(p.id)}
                className={`text-left p-3 border transition-all ${
                  prediction === p.id ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/30"
                }`}
              >
                <span className="text-xs font-display text-foreground block">{p.label}</span>
                <span className="text-[10px] text-muted-foreground">{p.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Token + Amount */}
        <div className="flex gap-3">
          <div className="flex-1 space-y-1">
            <span className="text-[10px] font-display tracking-widest text-muted-foreground uppercase">Token</span>
            <div className="flex gap-2">
              {(["LUM", "FGLD"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setToken(t)}
                  className={`flex-1 py-2 text-xs font-mono border transition-all ${
                    token === t ? "border-foreground text-foreground" : "border-border text-muted-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <span className="text-[10px] font-display tracking-widest text-muted-foreground uppercase">Amount ({balance} avail)</span>
            <input
              type="number"
              min={1}
              max={balance}
              value={amount}
              onChange={(e) => setAmount(Math.max(1, Math.min(balance, parseInt(e.target.value) || 0)))}
              className="w-full py-2 px-3 border border-border bg-transparent text-foreground text-sm font-mono focus:outline-none focus:border-foreground/50"
            />
          </div>
        </div>

        {/* Existing stakes */}
        {existingStakes.length > 0 && (
          <div className="space-y-1 pt-2 border-t border-border">
            <span className="text-[10px] font-display tracking-widest text-muted-foreground">YOUR STAKES</span>
            {existingStakes.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{PREDICTIONS.find((p) => p.id === s.prediction)?.label}</span>
                <span className="font-mono text-foreground">{s.amount} {s.token}</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleStake}
          disabled={!prediction || amount <= 0}
          className="w-full py-3 bg-foreground text-background text-xs font-display uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-30"
        >
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="h-3 w-3" />
            Stake {amount} {token}
          </div>
        </button>
      </div>
    </div>
  );
}
