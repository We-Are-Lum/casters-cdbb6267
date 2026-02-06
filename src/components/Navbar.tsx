import { Link, useLocation } from "react-router-dom";
import { ScrollText, Swords, Package, Map, BookOpen } from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Quests", icon: Swords },
  { to: "/chronicle", label: "Chronicle", icon: BookOpen },
  { to: "/inventory", label: "Inventory", icon: Package },
  { to: "/world", label: "World", icon: Map },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-gold/20 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <ScrollText className="h-6 w-6 text-primary transition-all group-hover:drop-shadow-[0_0_8px_hsl(45_90%_55%/0.6)]" />
          <span className="font-display text-lg font-bold text-primary tracking-widest">CASTERS</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const active = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-display tracking-wider transition-all ${
                  active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-mono">
            <span className="text-primary font-semibold">85 $LUM</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-accent font-semibold">32 $FGLD</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-faction-azure/30 border border-faction-azure/50 flex items-center justify-center">
            <span className="text-xs font-display font-bold text-faction-azure">AV</span>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex border-t border-border">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const active = location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-display transition-all ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
