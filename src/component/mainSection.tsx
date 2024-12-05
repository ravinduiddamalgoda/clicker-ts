import React, { useContext, useEffect } from "react";
import { GameContext } from "../context/GameContext";
import { levelIcons, levelMax } from "../constants/leveldata";
import FooterMain from "./footerMain";

// Define the context properties for type safety
interface GlobalContextProps {
  level: number;
  fCount: number;
  setfCount: React.Dispatch<React.SetStateAction<number>>;
}

const MainSection: React.FC = () => {
  const { level, fCount, setfCount } = useContext(
    GameContext
  ) as GlobalContextProps;

  const progressPercentage = Math.min(
    (fCount / levelMax[level - 1]) * 100,
    100
  );

  const handleStart = () => {
    setfCount((prevCount) => prevCount + 10);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="flex flex-col justify-center gap-7 items-center bg-gray-800 px-6 py-10 rounded-xl shadow-lg w-screen sm:w-[500px] min-h-screen">
        <div className="text-4xl font-spicyrice text-goldenYellow uppercase">
          Level {level}
        </div>
        <button onClick={handleStart}>
          <img
            src={levelIcons[level - 1]}
            alt="Game Icon"
            className="h-60 w-60 sm:h-80 sm:w-80 rounded-full bg-gray-700 p-1 shadow-glow"
          />
        </button>
        <div className="text-4xl font-spicyrice text-goldenYellow">
          F$: {fCount}
        </div>
        <div className="bg-gray-600 h-4 rounded-full shadow-glow w-4/5 sm:my-2">
          <div
            className="bg-magentaPurple h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div>
          <FooterMain />
        </div>
        
      </div>
    </div>
  );
};

export default MainSection;
