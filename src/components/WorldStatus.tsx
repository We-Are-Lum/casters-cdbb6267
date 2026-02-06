import { Map } from "lucide-react";
import { MOCK_REGIONS } from "@/lib/mockData";
import { getFactionColor } from "@/lib/mockData";

export default function WorldStatus() {
  return (
    <div className="gradient-card rounded-lg border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Map className="h-4 w-4 text-primary" />
        <h3 className="font-display text-sm tracking-widest text-primary uppercase">World Status</h3>
      </div>

      <div className="space-y-3">
        {MOCK_REGIONS.map((region) => (
          <div key={region.id} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-display font-semibold text-foreground">{region.name}</span>
              {region.controllingFaction && (
                <span className={`text-xs font-display tracking-wider ${getFactionColor(region.controllingFaction)}`}>
                  {region.controllingFaction}
                </span>
              )}
            </div>
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  region.stability > 60 ? "bg-faction-verdant" : region.stability > 30 ? "bg-primary" : "bg-destructive"
                }`}
                style={{ width: `${region.stability}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              Stability: {region.stability}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
