"use client";
import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import { Button } from "./ui/button";

interface GameTypeSelectorProps {
  onGameTypeSelected: () => void;
}

export default function GameTypeSelector({ onGameTypeSelected }: GameTypeSelectorProps) {
  const { setTotalHoles, setStartingHole } = useGame();
  const [selected, setSelected] = useState<"18-1" | "18-10" | "9-1" | "9-10" | null>(null);

  const handleConfirm = () => {
    if (!selected) return;

    const [holes, start] = selected.split("-").map(Number);
    setTotalHoles(holes);
    setStartingHole(start);
    onGameTypeSelected();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center text-white mb-6">
        <h2 className="text-3xl font-bold mb-2">Select Your Game Type</h2>
        <p className="text-sm text-yellow-300">Choose your round format carefully — this can't be changed mid-game.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 w-full max-w-md mb-6">
        <Button
          onClick={() => setSelected("18-1")}
          className={cn(
            "w-full py-2 text-lg font-bold",
            selected === "18-1" ? "bg-yellow-500 text-black" : "bg-white text-black"
          )}
        >
          Full 18 Holes – Start at Hole 1
        </Button>
        <Button
          onClick={() => setSelected("18-10")}
          className={cn(
            "w-full py-2 text-lg font-bold",
            selected === "18-10" ? "bg-yellow-500 text-black" : "bg-white text-black"
          )}
        >
          Full 18 Holes – Start at Hole 10
        </Button>
        <Button
          onClick={() => setSelected("9-1")}
          className={cn(
            "w-full py-2 text-lg font-bold",
            selected === "9-1" ? "bg-yellow-500 text-black" : "bg-white text-black"
          )}
        >
          Front 9 Only
        </Button>
        <Button
          onClick={() => setSelected("9-10")}
          className={cn(
            "w-full py-2 text-lg font-bold",
            selected === "9-10" ? "bg-yellow-500 text-black" : "bg-white text-black"
          )}
        >
          Back 9 Only
        </Button>
      </div>

      <Button
        onClick={handleConfirm}
        disabled={!selected}
        className={cn(
          "w-full max-w-md text-black font-bold text-lg py-2",
          selected ? "bg-yellow-500 hover:bg-yellow-400" : "bg-gray-300 cursor-not-allowed"
        )}
      >
        Confirm Game Type
      </Button>
    </div>
  );
}

// Local utility to simplify Tailwind class merging
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
