import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import heroImage from "@/assets/hero-chronicler.jpg";

export default function Index() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-6">
      
      {/* Background with simple overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="The Chronicler" 
          className="w-full h-full object-cover opacity-20 grayscale" 
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      <div className="relative z-10 max-w-2xl w-full space-y-12 text-center animate-slide-up">
        <div className="space-y-4">
          <h1 className="font-display text-6xl md:text-8xl font-medium tracking-tight text-foreground">
            CASTERS
          </h1>
          <p className="text-xl text-muted-foreground font-light tracking-wide">
            Speak to Aelia. Shape the story.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <Link
            to="/chat"
            className="group relative inline-flex items-center gap-3 px-8 py-4 text-sm font-medium tracking-widest uppercase text-foreground border border-foreground/20 hover:border-foreground transition-all duration-300 bg-background/50 backdrop-blur-sm"
          >
            Speak to Aelia
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/how-to-play"
            className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors tracking-widest uppercase"
          >
            How the Game Works →
          </Link>
          
          <p className="text-xs text-muted-foreground/60 max-w-xs mx-auto leading-relaxed">
            "The world remembers what you say in public."
          </p>
        </div>
      </div>
    </div>
  );
}
