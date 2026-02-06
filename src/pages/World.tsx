import Navbar from "@/components/Navbar";
import WorldStatus from "@/components/WorldStatus";
import { FACTIONS, MOCK_REGIONS } from "@/lib/mockData";
import { getFactionColor, getFactionBgColor } from "@/lib/mockData";
import { Globe, Users } from "lucide-react";

export default function World() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 max-w-3xl space-y-8">
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-primary" />
          <h1 className="font-display text-2xl font-bold text-foreground tracking-wide">The World</h1>
        </div>

        <WorldStatus />

        {/* Factions */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-primary" />
            <h2 className="font-display text-xs tracking-[0.3em] text-primary uppercase">Factions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FACTIONS.map((faction) => (
              <div
                key={faction.name}
                className={`rounded-lg border border-border p-5 gradient-card`}
              >
                <h3 className={`font-display text-lg font-bold ${getFactionColor(faction.name)} mb-1`}>
                  {faction.name}
                </h3>
                <p className="text-xs italic text-muted-foreground mb-3">"{faction.motto}"</p>
                <p className="text-sm text-secondary-foreground">{faction.goal}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Regions detail */}
        <div>
          <h2 className="font-display text-xs tracking-[0.3em] text-primary uppercase mb-4">Regions</h2>
          <div className="space-y-3">
            {MOCK_REGIONS.map((region) => (
              <div key={region.id} className="gradient-card rounded-lg border border-border p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-base font-semibold text-foreground">{region.name}</h3>
                  {region.controllingFaction && (
                    <span className={`text-xs font-display tracking-wider px-2 py-0.5 rounded-full ${getFactionBgColor(region.controllingFaction)} ${getFactionColor(region.controllingFaction)}`}>
                      {region.controllingFaction}
                    </span>
                  )}
                </div>
                <p className="text-sm text-secondary-foreground">{region.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
