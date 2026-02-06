import { Link } from "react-router-dom";
import { ScrollText, ChevronRight } from "lucide-react";
import heroImage from "@/assets/hero-chronicler.jpg";

export default function Index() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="relative h-screen flex flex-col items-center justify-center">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute inset-0 bg-background/40" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto" style={{ animation: "fade-in-up 1s ease-out" }}>
          <ScrollText className="h-8 w-8 text-primary animate-float mx-auto mb-6" />

          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground tracking-wider mb-4 glow-text-gold">
            CASTERS
          </h1>

          <p className="text-lg text-secondary-foreground mb-8 italic">
            Speak to the Chronicler. Shape the story.
          </p>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-display text-sm tracking-widest uppercase transition-all gradient-gold text-background font-bold hover:opacity-90 glow-gold"
          >
            Enter
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-xl text-center px-6">
          <blockquote className="text-sm italic text-secondary-foreground border-l-2 border-gold/40 pl-4">
            "The world remembers what you say in public."
            <footer className="mt-1 text-xs text-primary font-display tracking-wider not-italic">— The Chronicler</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
