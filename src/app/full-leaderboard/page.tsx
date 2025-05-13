"use client";
import React from "react";
import Link from "next/link";
import { GameProvider, useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";

export default function FullLeaderboardPage() {
  return (
    <GameProvider>
      <HoleByHoleLeaderboard />
    </GameProvider>
  );
}

function HoleByHoleLeaderboard() {
  const { players, holes } = useGame();

  const teamScore = holes
    .filter((h) => h.shots.length > 0)
    .reduce((acc, h) => acc + h.teamStrokes, 0);

  return (
    <div className="min-h-screen bg-white text-black px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
        📊 Hole-by-Hole Leaderboard
      </h1>

      <div className="text-center mb-4 text-lg font-semibold text-green-700">
        Total Team Score: {teamScore}
      </div>

      {holes.length === 0 ? (
        <p className="text-center text-gray-500">No holes played yet.</p>
      ) : (
        <div className="space-y-4 text-sm">
          {holes.map((hole) => (
            <div key={hole.holeNumber} className="bg-gray-100 p-4 rounded shadow">
              <p className="font-semibold text-yellow-600 mb-2">
                Hole {hole.holeNumber} (Par {hole.par}) – Team Score: {hole.teamStrokes}
              </p>

              <ul className="ml-4 list-disc mb-1">
                {players.map((player) => {
                  const dotsFromShots = hole.shots.filter((s) => s.player === player).length;
                  const penaltyDots = hole.penalties[player]?.length || 0;
                  const bonusDots = [
                    hole.bonuses.closestToPin === player ? 1 : 0,
                    hole.bonuses.greenInTwo === player ? 1 : 0,
                    hole.bonuses.hitAndPutt === player ? 1 : 0,
                    hole.bonuses.cleanSweep &&
                    hole.shots.every((s) => s.player === player)
                      ? 1
                      : 0,
                  ].reduce((a, b) => a + b, 0);

                  const totalDots = dotsFromShots + bonusDots - penaltyDots;

                  return totalDots !== 0 ? (
                    <li key={player}>
                      {player}: {totalDots} dot{totalDots !== 1 ? "s" : ""}
                      {bonusDots > 0 && ` (+${bonusDots} bonus)`}
                      {penaltyDots > 0 && ` (−${penaltyDots} penalty)`}
                    </li>
                  ) : null;
                })}
              </ul>

              {hole.notes && (
                <p className="text-gray-600 italic ml-2">🏅 {hole.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <Link href="/game">
          <Button className="bg-gray-800 text-white hover:bg-gray-700">
            ⬅ Back to Scorecard
          </Button>
        </Link>
      </div>
    </div>
  );
}
