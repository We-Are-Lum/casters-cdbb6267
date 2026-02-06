import { Link } from "react-router-dom";
import { Package, Map, Menu } from "lucide-react";
import ChroniclerChat from "@/components/ChroniclerChat";
import SidePanel from "@/components/SidePanel";
import { MOCK_CHARACTER } from "@/lib/mockData";

export default function Dashboard() {
  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-background z-20">
        <Link to="/" className="font-display text-lg font-medium tracking-widest text-foreground hover:opacity-80 transition-opacity">
          CASTERS
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-muted-foreground">
            <span>{MOCK_CHARACTER.lum} LUM</span>
            <span className="opacity-20">|</span>
            <span>{MOCK_CHARACTER.fgld} FGLD</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/inventory"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Inventory"
            >
              <Package className="h-4 w-4" />
            </Link>
            <Link
              to="/world"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="World"
            >
              <Map className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 relative flex overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          <ChroniclerChat />
        </div>
        
        {/* Side panel is absolutely positioned/overlay on mobile, simplified integration */}
        <SidePanel />
      </div>
    </div>
  );
}
