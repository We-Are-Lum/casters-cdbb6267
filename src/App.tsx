import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { GameProvider } from "@/contexts/GameContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CharacterSelect from "./pages/CharacterSelect";
import Inventory from "./pages/Inventory";
import World from "./pages/World";
import Chat from "./pages/Chat";
import Chronicle from "./pages/Chronicle";
import HowToPlay from "./pages/HowToPlay";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GameProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/choose" element={<CharacterSelect />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/world" element={<World />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chronicle" element={<Chronicle />} />
              <Route path="/how-to-play" element={<HowToPlay />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </GameProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
