import { Link } from "react-router-dom";
import { MOCK_CHARACTER } from "@/lib/mockData";
import { ArrowLeft } from "lucide-react";
import InventoryPanel from "@/components/InventoryPanel";
import CharacterPanel from "@/components/CharacterPanel";

export default function Inventory() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-2xl space-y-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Chat
        </Link>
        <CharacterPanel character={MOCK_CHARACTER} />
        <InventoryPanel character={MOCK_CHARACTER} />
      </div>
    </div>
  );
}
