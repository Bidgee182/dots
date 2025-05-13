"use client";
import React, { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import { Button } from "./ui/button";
import Leaderboard from "./Leaderboard";
import type { HoleData } from "../context/GameContext";

const PAR_OPTIONS = [3, 4, 5];

export default function HoleScoring({ onComplete }: { onComplete: () => void }) {
  const {
    players,
    currentHoleIndex,
    advanceHole,
    holes,
    addHoleData,
    setCurrentHoleIndex,
    totalHoles,
  } = useGame();

  const [par, setPar] = useState<number | null>(null);
  const [selectedShots, setSelectedShots] = useState<{ [shot: string]: string }>({});
  const [greenHitMap, setGreenHitMap] = useState<{ [shot: string]: boolean | null }>({});
  const [puttResults, setPuttResults] = useState<{ [putt: string]: boolean | null }>({});
  const [showRecap, setShowRecap] = useState(false);
  const [bonusSummary, setBonusSummary] = useState<string[]>([]);
  const [showShots, setShowShots] = useState(false);

  useEffect(() => {
    resetHole();
  }, [currentHoleIndex]);

  const resetHole = () => {
    setPar(null);
    setSelectedShots({});
    setGreenHitMap({});
    setPuttResults({});
    setBonusSummary([]);
    setShowShots(false);
    setShowRecap(false);
  };

  const handleShotSelect = (shotType: string, player: string) => {
    setSelectedShots((prev) => ({
      ...prev,
      [shotType]: prev[shotType] === player ? "" : player,
    }));
  };

  const handleNext = () => {
    const bonuses: HoleData["bonuses"] = {
      closestToPin: null,
      greenInTwo: null,
      cleanSweep: false,
      hitAndPutt: null,
    };

    const notes: string[] = [];

    if (par === 3 && greenHitMap["Tee"] && selectedShots["Tee"]) {
      bonuses.closestToPin = selectedShots["Tee"] ?? null;
      notes.push(`${selectedShots["Tee"]} won Nearest the Pin!`);
    }

    const teamStrokes = Object.keys(selectedShots).length;

    const holeData: HoleData = {
      holeNumber: currentHoleIndex + 1,
      par: par ?? 0,
      shots: Object.entries(selectedShots).map(([type, player]) => ({ type, player })),
      bonuses,
      penalties: {},
      teamStrokes,
      notes: notes.join(", "),
    };

    addHoleData(holeData);
    setBonusSummary(notes);
    setShowRecap(true);
  };

  const handleAdvance = () => {
    setShowRecap(false);
    if (currentHoleIndex + 1 >= totalHoles) onComplete();
    else advanceHole();
  };

  const renderShotSelector = (label: string) => (
    <div className="mb-4">
      <p className="font-bold mb-1">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {players.map((player) => (
          <Button
            key={label + player}
            onClick={() => handleShotSelect(label, player)}
            className={selectedShots[label] === player ? "bg-yellow-500 text-black" : "bg-white text-black"}
          >
            {player}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-6 text-white">
      <h2 className="text-2xl font-bold text-yellow-300 text-center mb-4">
        Hole {currentHoleIndex + 1}
      </h2>

      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-6">
        <label className="block mb-2 text-sm font-bold">Select Hole Par:</label>
        <div className="flex gap-2 mb-4">
          {PAR_OPTIONS.map((value) => (
            <Button
              key={value}
              onClick={() => {
                setPar(value);
                setShowShots(true);
              }}
              className={par === value ? "bg-yellow-500 text-black" : "bg-white text-black"}
            >
              Par {value}
            </Button>
          ))}
        </div>

        {par && showShots && (
          <>
            {renderShotSelector("Tee")}
            {(par >= 4) && renderShotSelector("Shot 2")}
            {(par === 5) && renderShotSelector("Shot 3")}
            {renderShotSelector("Putt 1")}
          </>
        )}

        <div className="flex justify-between mt-6">
          <Button onClick={resetHole} className="bg-red-600 text-white">Reset Hole</Button>
          <Button onClick={handleNext} className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold">
            Next Hole ➡
          </Button>
        </div>

        {showRecap && (
          <div className="mt-6 p-4 bg-gray-900 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Hole Recap</h3>
            {bonusSummary.length > 0 ? (
              <ul className="list-disc list-inside">
                {bonusSummary.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            ) : (
              <p>No bonuses this hole.</p>
            )}
            <Button onClick={handleAdvance} className="mt-4 bg-green-600 text-white">
              Continue
            </Button>
          </div>
        )}
      </div>

      <Leaderboard />
    </div>
  );
}
