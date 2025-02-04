import GameBoard from "@/components/GameBoard";
import Keyboard from "@/components/Keyboard";
import GameHeader from "@/components/GameHeader";
import GameClue from "@/components/GameClue";
import GameInstructions from "@/components/GameInstructions";
import GameStats from "@/components/GameStats";
import { useWordleGame } from "@/hooks/useWordleGame";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const {
    gameMode,
    answer,
    gameState,
    keyStates,
    stats,
    clue,
    handleModeChange,
    handleKey,
    startNewGame
  } = useWordleGame();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar - Similar to Vim's tab bar */}
      <div className="bg-card border-b border-border p-1">
        <Tabs defaultValue="game" className="w-full">
          <TabsList>
            <TabsTrigger value="game">WORDLE.tsx</TabsTrigger>
            <TabsTrigger value="stats">STATS.md</TabsTrigger>
            <TabsTrigger value="help">HELP.txt</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content Area */}
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 rounded-lg"
      >
        {/* Left Sidebar - Like NerdTree */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full bg-card border-r border-border">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                <div className="text-sm font-mono">
                  <div className="text-muted-foreground mb-2">📁 WORDLE</div>
                  <div className="pl-4 space-y-1">
                    <div className="text-primary">📄 game.tsx</div>
                    <div>📄 stats.md</div>
                    <div>📄 help.txt</div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Main Editor Area */}
        <ResizablePanel defaultSize={80}>
          <Tabs defaultValue="game" className="h-full flex flex-col">
            <TabsContent value="game" className="flex-1 p-4 space-y-4">
              <GameHeader
                gameMode={gameMode}
                onModeChange={handleModeChange}
                onNewGame={startNewGame}
              />
              
              <GameClue clue={clue} />
              
              <div className="flex flex-col items-center gap-4">
                <GameStats
                  gamesPlayed={stats.gamesPlayed}
                  gamesWon={stats.gamesWon}
                  currentStreak={stats.currentStreak}
                  maxStreak={stats.maxStreak}
                />
                
                <GameBoard
                  guesses={gameState.guesses}
                  currentGuess={gameState.currentGuess}
                  answer={answer}
                />
              </div>

              <div className="mt-auto">
                <Keyboard
                  onKey={handleKey}
                  keyStates={keyStates}
                />
              </div>
            </TabsContent>

            <TabsContent value="stats" className="flex-1 p-4">
              <GameStats
                gamesPlayed={stats.gamesPlayed}
                gamesWon={stats.gamesWon}
                currentStreak={stats.currentStreak}
                maxStreak={stats.maxStreak}
              />
            </TabsContent>

            <TabsContent value="help" className="flex-1 p-4">
              <GameInstructions gameMode={gameMode} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Status Line */}
      <div className="bg-card border-t border-border p-2">
        <div className="text-sm font-mono text-muted-foreground flex justify-between">
          <span>NORMAL</span>
          <span>{gameMode.toUpperCase()} MODE</span>
          <span>UTF-8</span>
          <span>TypeScript</span>
        </div>
      </div>
    </div>
  );
};

export default Index;