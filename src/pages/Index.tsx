import { Link } from "react-router-dom";
import { ScrollText, ChevronRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-chronicler.jpg";

export default function Index() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Hero */}
      <div className="relative h-screen flex flex-col items-center justify-center">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute inset-0 bg-background/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto" style={{ animation: "fade-in-up 1s ease-out" }}>
          <div className="flex items-center justify-center gap-2 mb-6">
            <ScrollText className="h-8 w-8 text-primary animate-float" />
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground tracking-wider mb-4 glow-text-gold">
            CASTERS
          </h1>

          <p className="text-lg md:text-xl text-secondary-foreground mb-2 italic">
            An async, story-driven social strategy RPG
          </p>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-10">
            Played through Farcaster. Episodic quests. AI-moderated outcomes.
            Your posts shape the world. Your alliances define the story.
          </p>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-display text-sm tracking-widest uppercase transition-all gradient-gold text-background font-bold hover:opacity-90 glow-gold"
          >
            Enter the Chronicle
            <ChevronRight className="h-4 w-4" />
          </Link>

          <p className="mt-6 text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3 text-primary" />
            Sign in with Farcaster to begin
          </p>
        </div>

        {/* Chronicler quote */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-xl text-center px-6">
          <blockquote className="text-sm italic text-secondary-foreground border-l-2 border-gold/40 pl-4">
            "The world remembers what you say in public. Choose your words with care—or with reckless abandon. Both have consequences."
            <footer className="mt-1 text-xs text-primary font-display tracking-wider">— The Chronicler</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
