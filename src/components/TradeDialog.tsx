import { useState } from "react";
import { X, ArrowRightLeft } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { getFactionColor } from "@/lib/mockData";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function TradeDialog({ open, onClose }: Props) {
  const { character, otherCharacters, sendTrade, getPortraitUrl } = useGame();
  const [selectedTarget, setSelectedTarget] = useState<string>("");
  const [amount, setAmount] = useState(10);
  const [token, setToken] = useState<"LUM" | "FGLD">("LUM");
  const [message, setMessage] = useState("");

  if (!open || !character) return null;

  const balance = token === "LUM" ? character.lum : character.fgld;
  const target = otherCharacters.find((c) => c.id === selectedTarget);

  const handleTrade = () => {
    if (!selectedTarget) {
      toast({ title: "Select a character", variant: "destructive" });
      return;
    }
    if (amount <= 0 || amount > balance) {
      toast({ title: "Invalid amount", description: `You have ${balance} ${token}.`, variant: "destructive" });
      return;
    }

    const success = sendTrade(selectedTarget, amount, token, message);
    if (success) {
      toast({ title: "Trade sent!", description: `${amount} ${token} to ${target?.name}` });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-background border border-border w-full max-w-md mx-4 p-6 space-y-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-foreground" />
            <h2 className="font-display text-sm tracking-widest uppercase">Trade Tokens</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>

        <p className="text-xs text-muted-foreground">Send tokens to forge alliances, bribe rivals, or settle debts.</p>

        {/* Target selection */}
        <div className="space-y-2">
          <span className="text-[10px] font-display tracking-widest text-muted-foreground uppercase">Send To</span>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {otherCharacters.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedTarget(c.id)}
                className={`w-full flex items-center gap-3 p-3 border transition-all text-left ${
                  selectedTarget === c.id ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/30"
                }`}
              >
                <img src={getPortraitUrl(c.portraitIndex)} alt={c.name} className="w-8 h-8 rounded-full object-cover border border-border" />
                <div>
                  <span className="text-sm font-display text-foreground">{c.name}</span>
                  <span className={`block text-[10px] font-display tracking-wider ${getFactionColor(c.faction)}`}>{c.faction}</span>
                </div>
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

        {/* Message */}
        <div className="space-y-1">
          <span className="text-[10px] font-display tracking-widest text-muted-foreground uppercase">Message (optional)</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 200))}
            rows={2}
            placeholder="An alliance, or a bribe?"
            className="w-full py-2 px-3 border border-border bg-transparent text-foreground text-sm resize-none focus:outline-none focus:border-foreground/50 placeholder:text-muted-foreground/30"
          />
        </div>

        <button
          onClick={handleTrade}
          disabled={!selectedTarget || amount <= 0}
          className="w-full py-3 bg-foreground text-background text-xs font-display uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-30"
        >
          Send {amount} {token}
        </button>
      </div>
    </div>
  );
}
