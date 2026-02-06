import { useState } from "react";
import { ChevronLeft, ChevronRight, Package, Map } from "lucide-react";
import { MOCK_CHARACTER, MOCK_QUESTS } from "@/lib/mockData";
import InventoryPanel from "@/components/InventoryPanel";
import WorldStatus from "@/components/WorldStatus";
import QuestCard from "@/components/QuestCard";

type Tab = "quests" | "inventory" | "world";

export default function SidePanel() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("quests");

  const activeQuests = MOCK_QUESTS.filter((q) => q.status === "active");

  const tabs: { id: Tab; label: string; icon: typeof Package }[] = [
    { id: "quests", label: "Quests", icon: Map },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "world", label: "World", icon: Map },
  ];

  return (
    <>
      {/* Toggle button (visible when collapsed) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-secondary border border-border border-r-0 rounded-l-lg p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-full z-40 bg-background border-l border-border transition-all duration-300 ${
          open ? "w-80 lg:w-96" : "w-0"
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full w-80 lg:w-96">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex gap-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-display tracking-wider transition-all ${
                    tab === id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {tab === "quests" && (
              <>
                <h3 className="font-display text-xs tracking-[0.3em] text-primary uppercase">
                  Active Quests
                </h3>
                {activeQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </>
            )}
            {tab === "inventory" && <InventoryPanel character={MOCK_CHARACTER} />}
            {tab === "world" && <WorldStatus />}
          </div>
        </div>
      </div>
    </>
  );
}
