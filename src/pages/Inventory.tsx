import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import CharacterHeader from "@/components/CharacterHeader";
import InventoryPanel from "@/components/InventoryPanel";
import CharacterPanel from "@/components/CharacterPanel";
import { MOCK_CHARACTER } from "@/lib/mockData";

export default function Inventory() {
  const { character } = useGame();

  // Build a Character-compatible object from GameCharacter
  const displayChar = character
    ? {
        ...MOCK_CHARACTER,
        id: character.id,
        name: character.name,
        faction: character.faction,
        reputation: character.reputation,
        reputationTags: character.reputationTags as any,
        lum: character.lum,
        fgld: character.fgld,
        lootBags: character.lootBags,
      }
    : MOCK_CHARACTER;

  return (
    <div className="min-h-screen bg-background">
      <CharacterHeader />
      <div className="container py-8 max-w-2xl space-y-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quest
        </Link>
        <CharacterPanel character={displayChar} />
        <InventoryPanel character={displayChar} />
      </div>
    </div>
  );
}
