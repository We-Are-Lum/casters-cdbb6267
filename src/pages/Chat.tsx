import ChroniclerChat from "@/components/ChroniclerChat";
import GameSidebar from "@/components/GameSidebar";

export default function Chat() {
  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Chat is the main screen */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ChroniclerChat />
      </div>
      {/* Sidebar for game actions */}
      <GameSidebar />
    </div>
  );
}
