"use client";
import Link from "next/link"; // Ensure this is at the top of your file
import React, { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import { Button } from "./ui/button";
import Leaderboard from "./Leaderboard";

export default function HoleScoring({ onComplete }: { onComplete: () => void }) {
  const {
    players,
    currentHoleIndex,
    advanceHole,
    goBackHole,
    addHoleData,
    updateHoleData,
    holes,
    totalHoles,
  } = useGame();

  const [par, setPar] = useState<number | null>(null);
  const [shots, setShots] = useState<string[]>([]);
  const [putts, setPutts] = useState<string[]>([]);
  const [selectedShots, setSelectedShots] = useState<{ [label: string]: string }>({});
  const [greenHit, setGreenHit] = useState<boolean>(false);
  const [holed, setHoled] = useState<boolean>(false);
  const [recapShown, setRecapShown] = useState(false);
  const [bonusSummary, setBonusSummary] = useState<string[]>([]);
  const [shotThatHitGreen, setShotThatHitGreen] = useState<string | null>(null);
  const [penalties, setPenalties] = useState<{ [player: string]: string[] }>({});
  const [penaltyMode, setPenaltyMode] = useState<"hidden" | "none" | "active">("hidden");
  const [currentPenaltyIndex, setCurrentPenaltyIndex] = useState(0);
  const penaltyTypes = ["Out of Bounds", "Penalty Drop", "Air Swing", "Lost Ball"];
  useEffect(() => {
    const existingHole = holes[currentHoleIndex];
    if (!existingHole) {
      // fresh hole, clear everything
      setPar(null);
      setShots([]);
      setPutts([]);
      setSelectedShots({});
      setGreenHit(false);
      setHoled(false);
      setRecapShown(false);
      setBonusSummary([]);
      setShotThatHitGreen(null);
      setPenalties({});
      setPenaltyMode("hidden");
      setCurrentPenaltyIndex(0);
      return;
    }

    setPar(existingHole.par);

    const newShots = existingHole.shots
      .filter(s => !s.type.startsWith("Putt"))
      .map(s => s.type);
    const newPutts = existingHole.shots
      .filter(s => s.type.startsWith("Putt"))
      .map(s => s.type);

    const selectedMap: { [key: string]: string } = {};
    existingHole.shots.forEach((s) => {
      selectedMap[s.type] = s.player;
    });

    setShots(newShots.length ? newShots : []);
    setPutts(newPutts);
    setSelectedShots(selectedMap);
    setGreenHit(!!newPutts.length);
    setHoled(!!newPutts.length && !!selectedMap[`Putt ${newPutts.length}`]);
    setRecapShown(false);
    setBonusSummary(existingHole.notes ? existingHole.notes.split(" | ") : []);
    const greenShot = newShots.find((s) => selectedMap[s]);
    setShotThatHitGreen(greenShot ?? null);
  }, [currentHoleIndex]);

  useEffect(() => {
    if (!par) return;
    const initialShots = par === 3 ? ["Tee"] : ["Tee", "Shot 2"];
    setShots(initialShots);
  }, [par]);

  const resetHole = () => {
    setPar(null);
    setShots([]);
    setPutts([]);
    setSelectedShots({});
    setGreenHit(false);
    setHoled(false);
    setRecapShown(false);
    setBonusSummary([]);
    setShotThatHitGreen(null);
    setPenalties({});
    setPenaltyMode("hidden");
    setCurrentPenaltyIndex(0);

    updateHoleData({
      holeNumber: currentHoleIndex + 1,
      par: 0,
      shots: [],
      bonuses: { cleanSweep: false },
      penalties: {},
      teamStrokes: 0,
      notes: "",
    });
  };
  const assignPlayer = (label: string, player: string) => {
    setSelectedShots((prev) => ({
      ...prev,
      [label]: prev[label] === player ? "" : player,
    }));
  };

  const handleGreenHit = (label: string, hit: boolean) => {
    if (hit) {
      setGreenHit(true);
      setShotThatHitGreen(label);
      setPutts(["Putt 1"]);
    } else {
      const nextShotNum = shots.length + 1;
      setShots((prev) => [...prev, `Shot ${nextShotNum}`]);
    }
  };

  const handlePuttHoled = (label: string, made: boolean) => {
    if (made) {
      setHoled(true);
    } else {
      const nextPuttNum = putts.length + 1;
      setPutts((prev) => [...prev, `Putt ${nextPuttNum}`]);
    }
  };

  const handleNext = () => {
    if (!par) {
      alert("Please select a par before submitting this hole.");
      return;
    }

    const bonuses = {
      closestToPin: null,
      greenInTwo: null,
      cleanSweep: false,
      hitAndPutt: null,
    };

    const allShots = [...shots, ...putts].map((label) => ({
      type: label,
      player: selectedShots[label],
    }));

    const shotPlayers = allShots.map((s) => s.player);
    const uniquePlayers = new Set(shotPlayers);
    const notes: string[] = [];

    // All In
    if (uniquePlayers.size === 1) {
      notes.push(`${shotPlayers[0]} went All In!`);
    }

    // Nearest the Pin (Par 3 only, Tee hits green)
    if (par === 3 && greenHit && shotThatHitGreen === "Tee") {
      bonuses.closestToPin = selectedShots["Tee"];
      if (selectedShots["Tee"]) {
        notes.push(`${selectedShots["Tee"]} won Nearest the Pin!`);
      }
    }

    // Hit and Putt
    if (
      greenHit &&
      shotThatHitGreen &&
      selectedShots[shotThatHitGreen] &&
      selectedShots["Putt 1"] &&
      selectedShots[shotThatHitGreen] === selectedShots["Putt 1"]
    ) {
      bonuses.hitAndPutt = selectedShots["Putt 1"];
      notes.push(`${selectedShots["Putt 1"]} hit the green and holed the first putt!`);
    }

    // Clean Sweep
    if (uniquePlayers.size === 1 && putts.length <= 2) {
      bonuses.cleanSweep = true;
      notes.push("Clean Sweep!");
    }

    const holeData = {
      holeNumber: currentHoleIndex + 1,
      par,
      shots: allShots,
      bonuses,
      penalties,
      teamStrokes: allShots.length,
      notes: notes.length > 0 ? notes.join(" | ") : undefined,
    };

    const existing = holes[currentHoleIndex];
    if (existing) updateHoleData(holeData);
    else addHoleData(holeData);

    setBonusSummary(notes);
    setRecapShown(true);
  };

  const handleAdvance = () => {
    setRecapShown(false);
    if (currentHoleIndex + 1 >= totalHoles) onComplete();
    else advanceHole();
  };
  return (
    <div className="min-h-screen px-4 py-6 text-white">
      <h2 className="text-2xl font-bold text-yellow-300 text-center mb-4">
        Hole {currentHoleIndex + 1}
      </h2>

      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-6">
        <label className="block mb-2 text-sm font-bold">Par:</label>
        <select
          value={par ?? ""}
          onChange={(e) => setPar(Number(e.target.value))}
          className="mb-4 w-full px-3 py-2 rounded bg-white text-black font-bold"
        >
          <option value="">Select hole par</option>
          {[3, 4, 5].map((p) => (
            <option key={p} value={p}>Par {p}</option>
          ))}
        </select>

        {par && shots.map((label, i) => (
          <div key={label} className="mb-6">
            <p className="font-bold mb-1">{label}</p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {players.map((p) => (
                <Button
                  key={label + p}
                  onClick={() => assignPlayer(label, p)}
                  className={`w-full ${selectedShots[label] === p ? "bg-yellow-500 text-black" : "bg-white text-black"}`}
                >
                  {p}
                </Button>
              ))}
            </div>
            {!greenHit &&
              i === shots.length - 1 &&
              !(
                (par === 4 && label === "Tee") ||
                (par === 5 && label === "Tee")
              ) && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    onClick={() => handleGreenHit(label, true)}
                    className="w-full bg-green-500 text-white"
                  >
                    ✅ Hit Green
                  </Button>
                  <Button
                    onClick={() => handleGreenHit(label, false)}
                    className="w-full bg-red-500 text-white"
                  >
                    ❌ Missed
                  </Button>
                </div>
              )}
          </div>
        ))}

        {par && greenHit &&
          putts.map((label) => (
            <div key={label} className="mb-6">
              <p className="font-bold mb-1">{label}</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {players.map((p) => (
                  <Button
                    key={label + p}
                    onClick={() => assignPlayer(label, p)}
                    className={`w-full ${selectedShots[label] === p ? "bg-yellow-500 text-black" : "bg-white text-black"}`}
                  >
                    {p}
                  </Button>
                ))}
              </div>
              {!holed && label === putts[putts.length - 1] && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    onClick={() => handlePuttHoled(label, true)}
                    className="w-full bg-green-500 text-white"
                  >
                    ✅ Holed It
                  </Button>
                  <Button
                    onClick={() => handlePuttHoled(label, false)}
                    className="w-full bg-red-500 text-white"
                  >
                    ❌ Missed
                  </Button>
                </div>
              )}
            </div>
          ))}
        {/* Step 1: Ask if penalties need to be assigned */}
        {par && holed && penaltyMode === "hidden" && (
          <div className="mt-6">
            <p className="font-bold mb-2">Were there any penalties on this hole?</p>
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setPenaltyMode("active");
                  setCurrentPenaltyIndex(0);
                }}
                className="bg-red-600 text-white w-full"
              >
                Yes
              </Button>
              <Button
                onClick={() => {
                  setPenaltyMode("none");
                }}
                className="bg-green-600 text-white w-full"
              >
                No
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Show penalties one-by-one */}
{penaltyMode === "active" && currentPenaltyIndex < penaltyTypes.length && (
  <div className="mt-6 mb-6 min-h-[200px]">
    <p className="font-bold mb-2">Assign Penalty: {penaltyTypes[currentPenaltyIndex]}</p>
    <div className="grid grid-cols-2 gap-2">
      {players.map((player) => (
        <Button
          key={penaltyTypes[currentPenaltyIndex] + player}
          onClick={() => {
            setPenalties((prev) => {
              const playerPenalties = prev[player] || [];
              const thisPenalty = penaltyTypes[currentPenaltyIndex];
              return {
                ...prev,
                [player]: playerPenalties.includes(thisPenalty)
                  ? playerPenalties
                  : [...playerPenalties, thisPenalty],
              };
            });
          }}
          className={`w-full ${
            penalties[player]?.includes(penaltyTypes[currentPenaltyIndex])
              ? "bg-red-600 text-white"
              : "bg-white text-black"
          }`}
        >
          {player}
        </Button>
      ))}
    </div>

    <Button
      onClick={() => {
        if (currentPenaltyIndex + 1 >= penaltyTypes.length) {
          setPenaltyMode("none"); // ✅ End of stepper — show "Next Hole"
        } else {
          setCurrentPenaltyIndex(currentPenaltyIndex + 1); // ➡ Next penalty
        }
      }}
      className="w-full mt-3 bg-blue-600 text-white"
    >
      Next
    </Button>
  </div>
)}


        {/* Step 3: Next buttons shown only after penalties are done or skipped */}
        {par && !recapShown && penaltyMode !== "active" && (
          <>
            <Button onClick={handleNext} className="w-full bg-yellow-500 text-black font-bold mt-4">
              Next Hole ➡
            </Button>
            <Button onClick={resetHole} className="w-full bg-gray-600 text-white font-bold mt-2">
              🔄 Reset Hole
            </Button>
            <Button onClick={goBackHole} className="w-full bg-blue-600 text-white font-bold mt-2">
              ⬅ Back to Previous Hole
            </Button>
          </>
        )}

        {/* Recap and Continue */}
        {recapShown && (
          <div className="mt-6 p-4 bg-gray-900 rounded">
            <h3 className="text-lg font-bold mb-2">Hole Recap</h3>
            {bonusSummary.length ? (
              <ul className="list-disc list-inside text-green-400">
                {bonusSummary.map((b, i) => (
                  <li key={i}>🏆 {b}</li>
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
      <Link href="/full-leaderboard" className="block text-center mt-4">
  <Button className="bg-purple-700 hover:bg-purple-600 text-white">
    🔍 View Full Leaderboard
  </Button>
</Link>

    </div>
  );
}
