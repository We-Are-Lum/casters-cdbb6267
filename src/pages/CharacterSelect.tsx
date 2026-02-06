import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollText, Loader2, RefreshCw } from "lucide-react";
import { CHARACTER_IMAGES } from "@/lib/characterImages";
import { getFactionColor, getFactionBgColor } from "@/lib/mockData";
import type { Faction } from "@/lib/mockData";

interface CharacterProfile {
  name: string;
  faction: Faction;
  backstory: string;
}

const GENERATE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-characters`;

export default function CharacterSelect() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<CharacterProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const fetchCharacters = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(GENERATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({}),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || "Failed to summon characters");
      }
      const data = await resp.json();
      setCharacters(data.characters?.slice(0, 30) || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const handleConfirm = () => {
    if (selected === null) return;
    // For now, navigate to dashboard. Later this will persist.
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="text-center pt-10 pb-6 px-6">
        <ScrollText className="h-6 w-6 text-primary mx-auto mb-3" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-wider glow-text-gold mb-2">
          Choose Your Vessel
        </h1>
        <p className="text-sm text-secondary-foreground italic max-w-md mx-auto">
          The Chronicler has drawn thirty souls from the ether. Each carries a name, a history, and a fate yet unwritten.
        </p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-sm text-muted-foreground font-display tracking-wider">
            The Chronicler summons your choices...
          </p>
        </div>
      )}

      {error && (
        <div className="text-center py-20 px-6">
          <p className="text-sm text-destructive mb-4">*{error}*</p>
          <button
            onClick={fetchCharacters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-display hover:bg-secondary/80 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && characters.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 md:px-8 max-w-7xl mx-auto">
            {characters.map((char, i) => {
              const isSelected = selected === i;
              const image = CHARACTER_IMAGES[i] || CHARACTER_IMAGES[0];

              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`group relative rounded-lg overflow-hidden border-2 transition-all text-left ${
                    isSelected
                      ? "border-primary glow-gold scale-[1.02]"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  {/* Portrait */}
                  <div className="aspect-[3/4] relative">
                    <img
                      src={image}
                      alt={char.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                    {/* Info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <span
                        className={`text-[10px] font-display tracking-wider px-2 py-0.5 rounded-full ${getFactionBgColor(char.faction)} ${getFactionColor(char.faction)} mb-1 inline-block`}
                      >
                        {char.faction}
                      </span>
                      <h3 className="font-display text-sm font-bold text-foreground leading-tight">
                        {char.name}
                      </h3>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-xs font-bold text-background">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected character detail */}
          {selected !== null && characters[selected] && (
            <div className="max-w-2xl mx-auto px-6 mt-8 mb-6" style={{ animation: "fade-in-up 0.3s ease-out" }}>
              <div className="gradient-card rounded-lg border border-primary/30 p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={CHARACTER_IMAGES[selected]}
                    alt={characters[selected].name}
                    className="w-20 h-20 rounded-lg object-cover border border-border"
                  />
                  <div className="flex-1">
                    <span
                      className={`text-xs font-display tracking-wider px-2 py-0.5 rounded-full ${getFactionBgColor(characters[selected].faction)} ${getFactionColor(characters[selected].faction)} mb-1 inline-block`}
                    >
                      {characters[selected].faction}
                    </span>
                    <h2 className="font-display text-xl font-bold text-foreground mb-2">
                      {characters[selected].name}
                    </h2>
                    <p className="text-sm text-secondary-foreground italic leading-relaxed">
                      {characters[selected].backstory}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleConfirm}
                  className="mt-5 w-full py-3 rounded-lg font-display text-sm tracking-widest uppercase transition-all gradient-gold text-background font-bold hover:opacity-90 glow-gold"
                >
                  Claim This Identity
                </button>
              </div>
            </div>
          )}

          {/* Reroll */}
          <div className="text-center pb-10 mt-4">
            <button
              onClick={fetchCharacters}
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors font-display tracking-wider"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Ask the Chronicler for new souls
            </button>
          </div>
        </>
      )}
    </div>
  );
}
