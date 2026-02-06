import { MOCK_CHRONICLE } from "@/lib/mockData";
import Navbar from "@/components/Navbar";
import ChronicleEntryCard from "@/components/ChronicleEntry";
import { BookOpen } from "lucide-react";

export default function Chronicle() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="h-5 w-5 text-primary" />
          <h1 className="font-display text-2xl font-bold text-foreground tracking-wide">The Chronicle</h1>
        </div>

        <blockquote className="text-sm italic text-secondary-foreground border-l-2 border-gold/30 pl-4 mb-8">
          "What follows is the record of deeds and consequences, as observed by the Chronicler.
          Some events are true. All events are real."
          <footer className="mt-1 text-xs text-primary font-display tracking-wider not-italic">— The Chronicler</footer>
        </blockquote>

        <div className="space-y-0">
          {MOCK_CHRONICLE.map((entry) => (
            <ChronicleEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </main>
    </div>
  );
}
