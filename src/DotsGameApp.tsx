"use client";
import React, { useEffect, useState } from "react";
import PlayerEntry from "./components/PlayerEntry";
import GameTypeSelector from "./components/GameTypeSelector";
import HoleScoring from "./components/HoleScoring";
import TeamScoreSummary from "./components/TeamScoreSummary";
import Leaderboard from "./components/Leaderboard";
import { GameProvider, useGame } from "./context/GameContext";
import { useRouter } from "next/navigation";

export default function DotsGameApp() {
  const [playersEntered, setPlayersEntered] = useState(false);
  const [gameTypeSelected, setGameTypeSelected] = useState(false);
  const router = useRouter();

  return (
    <GameProvider>
      <GameWrapper
        playersEntered={playersEntered}
        setPlayersEntered={setPlayersEntered}
        gameTypeSelected={gameTypeSelected}
        setGameTypeSelected={setGameTypeSelected}
        router={router}
      />
    </GameProvider>
  );
}

function GameWrapper({
  playersEntered,
  setPlayersEntered,
  gameTypeSelected,
  setGameTypeSelected,
  router,
}: {
  playersEntered: boolean;
  setPlayersEntered: (value: boolean) => void;
  gameTypeSelected: boolean;
  setGameTypeSelected: (value: boolean) => void;
  router: any;
}) {
  const { players, holes, totalHoles } = useGame();

  const gameFinished =
    holes.length === totalHoles &&
    holes.every((hole) => hole.shots.length > 0);

  // ✅ Auto-redirect to full leaderboard when finished
  useEffect(() => {
    if (gameFinished) {
      router.push("/full-leaderboard");
    }
  }, [gameFinished, router]);

  if (!playersEntered) {
    return <PlayerEntry onPlayersEntered={() => setPlayersEntered(true)} />;
  }

  if (!gameTypeSelected) {
    return (
      <GameTypeSelector onGameTypeSelected={() => setGameTypeSelected(true)} />
    );
  }

  return (
    <>
      <HoleScoring onComplete={() => {}} />
      <TeamScoreSummary />
      <Leaderboard />
    </>
  );
}
