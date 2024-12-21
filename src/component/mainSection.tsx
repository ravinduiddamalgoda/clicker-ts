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
      <div className="flex flex-col justify-center gap-7 items-center bg-gray-800 px-6 py-5 rounded-xl shadow-lg w-screen sm:w-[500px] min-h-screen sm:min-h-[calc(100vh-8rem)] sm:my-4">
        <div className="flex gap-8">
          <div className="text-4xl font-spicyrice text-goldenYellow uppercase">
            Level {level}
          </div>
          <button className="text-lg border-2 px-4 rounded-lg font-spicyrice text-white font-extralight">
           Info
          </button>
        </div>
        <button onClick={handleStart} className="relative group">
          <img
            src={levelIcons[level - 1]}
            alt="Game Icon"
            className="h-60 w-60 rounded-full bg-gray-700 p-1 shadow-glow group-active:scale-95 group-active:shadow-lg transition-transform duration-150 ease-in-out"
          />
          <span className="absolute inset-0 rounded-full bg-gray-500 opacity-0 group-active:opacity-50 transition-opacity duration-200"></span>
        </button>
        <div className="text-4xl font-spicyrice text-goldenYellow">
          F$: {fCount.toFixed(2)}
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
