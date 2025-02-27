import React, { useContext, useState } from "react";
import { GameContext } from "../context/GameContext";
import { levelIcons, levelMax } from "../constants/leveldata";
import { myConstants} from "../config/config";
import FooterMain from "./footerMain";


interface GlobalContextProps {
  level: number;
  fCount: number;
  setfCount: React.Dispatch<React.SetStateAction<number>>;
}

const MainSection: React.FC = () => {
  const { level, fCount, setfCount } = useContext(
    GameContext
  ) as GlobalContextProps;

  const [showInfo, setShowInfo] = useState(false);
  const isMaxLevel = level >= myConstants.Max_Level;
  const progressPercentage = Math.min(
    (fCount / levelMax[level - 1]) * 100,
    100
  );

  const handleStart = () => {
    setfCount((prevCount) => prevCount + 10);
  };

  return (
    <div className="flex flex-col w-full items-center justify-center text-center ">
      <div className="flex flex-col w-60"> 
        
        <button onClick={handleStart} className="relative group">
          <img
            src={levelIcons[level - 1]}
            alt="Game Icon"
            className="h-60 w-60 rounded-full bg-gray-700 p-1 shadow-glow group-active:scale-95 group-active:shadow-lg transition-transform duration-150 ease-in-out"
          />
          <span className="absolute inset-0 rounded-full bg-gray-500 opacity-0 group-active:opacity-50 transition-opacity duration-200"></span>
        </button>

        <div className="text-2xl text-goldenYellow mt-5">
        {isMaxLevel ? 'Max Level' : `Level ${level}`}
            <div className="text-3xl text-goldenYellow mt-2">
              F$: {fCount /*.toFixed(2)*/} 
            </div>
        </div>
        
      
          <div className="bg-gray-600 h-4 rounded-full shadow-glow sm:my-2">
            <div
              className="bg-magentaPurple h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
            <div className="text-sm text-white pt-1">
            {!isMaxLevel ? `${fCount}/${levelMax[level - 1]}` : ""}
            </div>
          </div>
          
        
      </div>
    </div>
  );
};

export default MainSection;
