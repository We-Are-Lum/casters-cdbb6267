import { Link } from "react-router-dom";
import { ScrollText, Package, Map } from "lucide-react";
import ChroniclerChat from "@/components/ChroniclerChat";
import SidePanel from "@/components/SidePanel";
import { MOCK_CHARACTER } from "@/lib/mockData";
import { getFactionColor } from "@/lib/mockData";

export default function Dashboard() {
  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Minimal top bar */}
      <nav className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <ScrollText className="h-5 w-5 text-primary" />
          <span className="font-display text-sm font-bold text-primary tracking-widest">CASTERS</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono">
            <span className="text-primary font-semibold">{MOCK_CHARACTER.lum} $LUM</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-accent font-semibold">{MOCK_CHARACTER.fgld} $FGLD</span>
          </div>

          <Link
            to="/inventory"
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5"
            title="Inventory"
          >
            <Package className="h-4 w-4" />
          </Link>
          <Link
            to="/world"
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5"
            title="World"
          >
            <Map className="h-4 w-4" />
          </Link>

          <div className="h-7 w-7 rounded-full bg-faction-azure/30 border border-faction-azure/50 flex items-center justify-center">
            <span className="text-[10px] font-display font-bold text-faction-azure">AV</span>
          </div>
        </div>
      </nav>

      {/* Chat takes the rest */}
      <div className="flex-1 overflow-hidden">
        <ChroniclerChat />
      </div>

      <SidePanel />
    </div>
  );
}
