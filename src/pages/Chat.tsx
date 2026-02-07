import { useGame } from "@/contexts/GameContext";
import CharacterHeader from "@/components/CharacterHeader";
import ChroniclerChat from "@/components/ChroniclerChat";

export default function Chat() {
  const { character } = useGame();

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {character && <CharacterHeader />}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ChroniclerChat />
      </div>
    </div>
  );
}
