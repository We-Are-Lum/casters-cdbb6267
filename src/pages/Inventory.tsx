import { MOCK_CHARACTER } from "@/lib/mockData";
import Navbar from "@/components/Navbar";
import InventoryPanel from "@/components/InventoryPanel";
import CharacterPanel from "@/components/CharacterPanel";

export default function Inventory() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 max-w-2xl space-y-6">
        <CharacterPanel character={MOCK_CHARACTER} />
        <InventoryPanel character={MOCK_CHARACTER} />
      </main>
    </div>
  );
}
