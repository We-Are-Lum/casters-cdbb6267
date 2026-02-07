import { Loader2 } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import CharacterHeader from "@/components/CharacterHeader";
import QuestArena from "@/components/QuestArena";

export default function Dashboard() {
  const { character, loading } = useGame();

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="text-xs font-display tracking-widest text-muted-foreground uppercase">Loading...</span>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Character not found.</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <CharacterHeader />
      <QuestArena />
    </div>
  );
}
