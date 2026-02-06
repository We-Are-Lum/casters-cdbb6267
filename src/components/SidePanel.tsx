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
    { id: "quests", label: "QUESTS", icon: Map },
    { id: "inventory", label: "INVENTORY", icon: Package },
    { id: "world", label: "WORLD", icon: Map },
  ];

  return (
    <>
      {/* Toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-background border border-border border-r-0 p-3 text-muted-foreground hover:text-foreground transition-colors shadow-sm"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-full z-40 bg-background border-l border-border transition-transform duration-300 ease-in-out w-80 lg:w-96 shadow-xl ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
            <span className="font-display text-xs font-medium tracking-[0.2em] uppercase">
              {tabs.find(t => t.id === tab)?.label}
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border/40">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-1 py-3 text-[10px] font-medium tracking-widest uppercase transition-colors ${
                  tab === id
                    ? "text-foreground border-b-2 border-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {tab === "quests" && (
              <div className="space-y-4">
                 {activeQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </div>
            )}
            {tab === "inventory" && <InventoryPanel character={MOCK_CHARACTER} />}
            {tab === "world" && <WorldStatus />}
          </div>
        </div>
      </div>
    </>
  );
}
