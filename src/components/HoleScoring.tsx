"use client";
import React, { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import { Button } from "./ui/button";
import Leaderboard from "./Leaderboard";

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
    setPar(null);
    setSelectedShots({});
    setGreenHitMap({});
    setPuttResults({});
    setBonusSummary([]);
    setShowRecap(false);
    setShowShots(false);
  }, [currentHoleIndex]);

  const handleShotSelect = (shotType: string, player: string) => {
    setSelectedShots((prev) => ({
      ...prev,
      [shotType]: prev[shotType] === player ? "" : player,
    }));
  };

  const handleNext = () => {
    const bonuses: import("../context/GameContext").HoleData["bonuses"] = {
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

    addHoleData({
      holeNumber: currentHoleIndex + 1,
      par: par ?? 0,
      shots: Object.entries(selectedShots).map(([type, player]) => ({ type, player })),
      bonuses,
      penalties: {},
      teamStrokes,
      notes: notes.join(", "),
    });

    setBonusSummary(notes);
    setShowRecap(true);
  };

  const handleAdvance = () => {
    setShowRecap(false);
    if (currentHoleIndex + 1 >= totalHoles) {
      onComplete();
    } else {
      advanceHole();
    }
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
        {!par && (
          <>
            <label className="block mb-2 text-sm font-bold">Select Par:</label>
            <div className="flex gap-2 mb-4">
              {[3, 4, 5].map((value) => (
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
          </>
        )}

        {par && showShots && (
          <>
            {renderShotSelector("Tee")}
            {par >= 4 && renderShotSelector("Shot 2")}
            {par === 5 && renderShotSelector("Shot 3")}
            {renderShotSelector("Putt 1")}
          </>
        )}

        <Button
          onClick={handleNext}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold mt-6"
        >
          Next Hole ➡
        </Button>

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
