import React, { useContext, useEffect } from "react";
import { GameContext } from "../context/GameContext";
import { levelIcons, levelMax } from "../constants/leveldata";

// Define the context properties for type safety
interface GlobalContextProps {
  level: number;
  fCount: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  setfCount: React.Dispatch<React.SetStateAction<number>>;
}

const MainSection: React.FC = () => {
  const { level, fCount, setLevel, setfCount } = useContext(GameContext) as GlobalContextProps;

  // Increment level if fCount exceeds the threshold
  useEffect(() => {
    if (fCount >= levelMax[level - 1]) {
      setLevel((prevLevel) => Math.min(prevLevel + 1, levelMax.length));
    }
  }, [fCount, level, setLevel]);

  // Calculate progress bar percentage
  const progressPercentage = Math.min((fCount / levelMax[level - 1]) * 100, 100);

  // Handle the Start button click
  const handleStart = () => {
    setfCount((prevCount) => prevCount + 10);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      <div className="flex flex-col justify-between items-center bg-gray-800 p-6 rounded-xl shadow-lg w-80 min-h-[500px]">
        <h1 className="text-4xl font-spicyrice text-goldenYellow uppercase">Level {level}</h1>
        <img
          src={levelIcons[level - 1]}
          alt="Game Icon"
          className="h-40 w-40 rounded-full bg-gray-700 p-1 shadow-glow"
        />
        <h1 className="text-4xl font-spicyrice text-goldenYellow">F$: {fCount}</h1>
        <div className="w-full bg-gray-600 h-4 rounded-full mt-4">
          <div
            className="bg-magentaPurple h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <button
          className="mt-4 font-spicyrice bg-magentaPurple text-white text-3xl uppercase px-10 py-2 rounded-lg shadow-glow hover:bg-blue-600"
          onClick={handleStart}
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default MainSection;
