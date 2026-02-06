import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, RefreshCw, ArrowRight } from "lucide-react";
import { CHARACTER_IMAGES } from "@/lib/characterImages";
import { supabase } from "@/integrations/supabase/client";
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
  const [saving, setSaving] = useState(false);

  const fetchCharacters = async () => {
    setLoading(true);
    setError(null);
    setSelected(null);
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
        throw new Error("Failed to summon characters");
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

  const handleConfirm = async () => {
    if (selected === null) return;
    const char = characters[selected];
    setSaving(true);
    try {
      const { data, error: insertError } = await supabase
        .from("characters")
        .insert({
          name: char.name,
          faction: char.faction,
          backstory: char.backstory,
          portrait_index: selected,
          is_claimed: true,
        })
        .select("id")
        .single();

      if (insertError) throw insertError;
      navigate(`/dashboard?character=${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save character");
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <header className="max-w-7xl mx-auto flex justify-between items-start mb-12">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight mb-2">
            CHOOSE YOUR VESSEL
          </h1>
          <p className="text-muted-foreground font-light max-w-md text-sm leading-relaxed">
            The Chronicler has drawn thirty souls from the ether. 
            Select one to begin your journey.
          </p>
        </div>
        
        {!loading && !error && (
          <button
            onClick={fetchCharacters}
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            Reroll All
          </button>
        )}
      </header>

      {loading && (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mb-4" />
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Summoning...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-20">
          <p className="text-sm text-destructive mb-4">{error}</p>
          <button onClick={fetchCharacters} className="underline text-sm">Try Again</button>
        </div>
      )}

      {!loading && !error && (
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
          {characters.map((char, i) => {
            const isSelected = selected === i;
            const image = CHARACTER_IMAGES[i] || CHARACTER_IMAGES[0];

            return (
              <div key={i} className="group cursor-pointer" onClick={() => setSelected(i)}>
                <div className={`relative aspect-[3/4] mb-3 transition-all duration-300 ${isSelected ? 'ring-1 ring-foreground p-1' : 'grayscale hover:grayscale-0'}`}>
                  <img
                    src={image}
                    alt={char.name}
                    className="w-full h-full object-cover bg-muted"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-foreground/10" />
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {char.faction}
                    </span>
                  </div>
                  <h3 className={`font-display text-sm font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                    {char.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selection Drawer/Modal */}
      {selected !== null && characters[selected] && (
        <div className="fixed inset-x-0 bottom-0 z-50 p-6 pointer-events-none flex justify-center">
          <div className="pointer-events-auto bg-background border border-border shadow-2xl max-w-2xl w-full p-6 md:p-8 animate-slide-up flex flex-col md:flex-row gap-6 md:items-center">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-display text-xl font-medium">{characters[selected].name}</span>
                <span className="text-xs border border-border px-2 py-0.5 rounded-full text-muted-foreground uppercase tracking-wider">
                  {characters[selected].faction}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-serif italic">
                "{characters[selected].backstory}"
              </p>
            </div>
            
            <button
              onClick={handleConfirm}
              disabled={saving}
              className="whitespace-nowrap bg-foreground text-background px-8 py-3 text-xs font-medium uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <>Confirm <ArrowRight className="h-3 w-3" /></>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
