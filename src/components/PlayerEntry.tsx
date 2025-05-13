"use client";
import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";

interface PlayerEntryProps {
  onPlayersEntered: () => void;
}

export default function PlayerEntry({ onPlayersEntered }: PlayerEntryProps) {
  const { setPlayers, setTotalHoles, setStartingHole } = useGame();
  const [names, setNames] = useState(["", "", "", ""]);
  const [selectedGameType, setSelectedGameType] = useState<string>("");

  const handleChange = (index: number, value: string) => {
    const updated = [...names];
    updated[index] = value;
    setNames(updated);
  };

  const handleSubmit = () => {
    const enteredPlayers = names.filter((n) => n.trim() !== "");
    if (enteredPlayers.length < 2) {
      alert("Please enter at least 2 player names.");
      return;
    }
    if (!selectedGameType) {
      alert("Please select a game type.");
      return;
    }

    const [holes, start] = selectedGameType.split("-").map(Number);
    setPlayers(enteredPlayers);
    setTotalHoles(holes);
    setStartingHole(start);
    onPlayersEntered();
  };

  return (
    <div className="min-h-screen px-4 flex flex-col items-center justify-start pt-10">
      <h1 className="text-4xl font-bold text-white text-center mb-6">
        LGLG Dots Ambrose
      </h1>

      <div className="bg-white rounded-2xl shadow-lg border-2 border-yellow-400 p-6 w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-black">Enter Player Names</h2>

        {names.map((name, index) => (
          <Input
            key={index}
            placeholder={`Player ${index + 1}`}
            value={name}
            onChange={(e) => handleChange(index, e.target.value)}
          />
        ))}

        <div className="mt-4">
          <label className="block text-black font-semibold mb-1">
            Select Game Type
          </label>
          <select
            value={selectedGameType}
            onChange={(e) => setSelectedGameType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 text-black"
          >
            <option value="">---- Choose starting hole ----</option>
            <option value="18-1">18 Holes (Start at Hole 1)</option>
            <option value="18-10">18 Holes (Start at Hole 10)</option>
            <option value="9-1">9 Holes (Start at Hole 1)</option>
            <option value="9-10">9 Holes (Start at Hole 10)</option>
          </select>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={
            names.filter((n) => n.trim() !== "").length < 2 || !selectedGameType
          }
          className={cn(
            "w-full font-bold text-lg py-2 text-black transition-colors",
            names.filter((n) => n.trim() !== "").length >= 2 && selectedGameType
              ? "bg-yellow-500 hover:bg-yellow-400"
              : "bg-gray-300 cursor-not-allowed"
          )}
        >
          Confirm Players
        </Button>
      </div>
    </div>
  );
}
