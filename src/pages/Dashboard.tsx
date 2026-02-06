import { MOCK_QUESTS, MOCK_CHRONICLE, MOCK_CHARACTER } from "@/lib/mockData";
import Navbar from "@/components/Navbar";
import QuestCard from "@/components/QuestCard";
import ChronicleEntryCard from "@/components/ChronicleEntry";
import CharacterPanel from "@/components/CharacterPanel";
import InventoryPanel from "@/components/InventoryPanel";
import WorldStatus from "@/components/WorldStatus";

export default function Dashboard() {
  const activeQuests = MOCK_QUESTS.filter((q) => q.status === "active");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar - Character & Inventory */}
          <div className="lg:col-span-3 space-y-6">
            <CharacterPanel character={MOCK_CHARACTER} />
            <InventoryPanel character={MOCK_CHARACTER} />
          </div>

          {/* Center - Active Quests */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="font-display text-xs tracking-[0.3em] text-primary uppercase mb-4">Active Quests</h2>
              <div className="space-y-4">
                {activeQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar - Chronicle & World */}
          <div className="lg:col-span-4 space-y-6">
            <WorldStatus />

            <div className="gradient-card rounded-lg border border-border p-5">
              <h3 className="font-display text-xs tracking-[0.3em] text-primary uppercase mb-5">The Chronicle</h3>
              <div className="space-y-0">
                {MOCK_CHRONICLE.map((entry) => (
                  <ChronicleEntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
