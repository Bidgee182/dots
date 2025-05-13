"use client";
import { useGame } from "../context/GameContext";
import { calculateDotCounts } from "../lib/dotUtils";

export default function Leaderboard() {
  const { players, holes } = useGame();
  const dotCounts = calculateDotCounts(holes, players);

  const teamScore = holes
  .filter((h) => h.shots.length > 0 && typeof h.teamStrokes === "number")
  .reduce((acc, h) => acc + h.teamStrokes, 0);

  const parTotal = holes
  .filter((h) => h.shots.length > 0)
  .reduce((acc, h) => acc + h.par, 0);

  const scoreVsPar = teamScore - parTotal;

  return (
    <div className="bg-white text-black p-4 rounded-xl shadow max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold text-center text-yellow-500 mb-4">Leaderboard</h2>

      <ul className="divide-y divide-gray-300 mb-4">
        {players.map((player) => (
          <li key={player} className="py-2 flex justify-between font-medium">
            <span>{player}</span>
            <span>{dotCounts[player]} dots</span>
          </li>
        ))}
      </ul>

      <div className="text-center text-sm mt-4">
        <p>Team Score: <strong>{teamScore}</strong></p>
        <p>Scratch Par: <strong>{parTotal}</strong></p>
        <p className={scoreVsPar < 0 ? "text-green-600" : scoreVsPar > 0 ? "text-red-600" : "text-black"}>
          Score vs Par: <strong>{scoreVsPar > 0 ? "+" : ""}{scoreVsPar}</strong>
        </p>
      </div>
    </div>
  );
}
