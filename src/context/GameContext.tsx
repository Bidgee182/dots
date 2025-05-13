"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
export type Shot = {
  type: string;
  player: string;
};

export type HoleData = {
  holeNumber: number;
  par: number;
  shots: Shot[];
  bonuses: {
    closestToPin?: string | null;
    greenInTwo?: string | null;
    cleanSweep: boolean;
    hitAndPutt?: string | null;
  };
  penalties: Record<string, string[]>;
  teamStrokes: number;
  notes?: string;
};

interface GameContextType {
  players: string[];
  setPlayers: (players: string[]) => void;
  totalHoles: number;
  setTotalHoles: (n: number) => void;
  startingHole: number;
  setStartingHole: (n: number) => void;
  currentHoleIndex: number;
  setCurrentHoleIndex: (n: number) => void;
  holes: HoleData[];
  addHoleData: (hole: HoleData) => void;
  updateHoleData: (hole: HoleData) => void;
  advanceHole: () => void;
  goBackHole: () => void;
  resetGame: () => void;
}

const defaultContext: GameContextType = {
  players: [],
  setPlayers: () => {},
  totalHoles: 18,
  setTotalHoles: () => {},
  startingHole: 1,
  setStartingHole: () => {},
  currentHoleIndex: 0,
  setCurrentHoleIndex: () => {},
  holes: [],
  addHoleData: () => {},
  updateHoleData: () => {},
  advanceHole: () => {},
  goBackHole: () => {},
  resetGame: () => {},
};

const GameContext = createContext<GameContextType>(defaultContext);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [players, setPlayers] = useState<string[]>([]);
  const [totalHoles, setTotalHoles] = useState<number>(18);
  const [startingHole, setStartingHole] = useState<number>(1);
  const [currentHoleIndex, setCurrentHoleIndex] = useState<number>(0);
  const [holes, setHoles] = useState<HoleData[]>([]);

  const addHoleData = (hole: HoleData) => {
    setHoles((prev) => {
      const updated = [...prev];
      updated[currentHoleIndex] = hole;
      return updated;
    });
  };

  const updateHoleData = (hole: HoleData) => {
  setHoles((prev) => {
    const updated = [...prev];
    updated[hole.holeNumber - 1] = hole;
    return updated;
  });
};


  const advanceHole = () => {
    if (currentHoleIndex + 1 < totalHoles) {
      setCurrentHoleIndex((prev) => prev + 1);
    }
  };

  const goBackHole = () => {
    if (currentHoleIndex > 0) {
      setCurrentHoleIndex((prev) => prev - 1);
    }
  };

  const resetGame = () => {
    setPlayers([]);
    setTotalHoles(18);
    setStartingHole(1);
    setCurrentHoleIndex(0);
    setHoles([]);
  };

  return (
    <GameContext.Provider
      value={{
        players,
        setPlayers,
        totalHoles,
        setTotalHoles,
        startingHole,
        setStartingHole,
        currentHoleIndex,
        setCurrentHoleIndex,
        holes,
        addHoleData,
        updateHoleData,
        advanceHole,
        goBackHole,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
