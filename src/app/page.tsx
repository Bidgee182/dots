"use client";
import { useState, useEffect } from "react";
import { GameProvider, useGame } from "../context/GameContext";
import PlayerEntry from "../components/PlayerEntry";
import HoleScoring from "../components/HoleScoring";
import { useRouter } from "next/navigation";

function GameFlow() {
  const { currentHoleIndex, totalHoles, resetGame, holes } = useGame();
  const [stage, setStage] = useState<"entry" | "scoring" | "summary">("entry");
  const router = useRouter();

  // ✅ Automatically go to /full-leaderboard on game completion
  useEffect(() => {
    const isComplete =
      holes.length === totalHoles && holes.every((h) => h.shots.length > 0);
    if (stage === "summary" || isComplete) {
      router.push("/full-leaderboard");
    }
  }, [stage, holes, totalHoles, router]);

  if (stage === "entry") {
    return <PlayerEntry onPlayersEntered={() => setStage("scoring")} />;
  }

  if (stage === "scoring") {
    return (
      <HoleScoring
        onComplete={() => {
          setStage("summary");
        }}
      />
    );
  }

  return null; // Nothing to render after redirection
}

export default function Home() {
  return (
    <GameProvider>
      <GameFlow />
    </GameProvider>
  );
}
