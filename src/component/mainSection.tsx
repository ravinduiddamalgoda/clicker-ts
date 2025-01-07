import React, { useContext, useState } from "react";
import { GameContext } from "../context/GameContext";
import { levelIcons, levelMax } from "../constants/leveldata";
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

  const progressPercentage = Math.min(
    (fCount / levelMax[level - 1]) * 100,
    100
  );

  const handleStart = () => {
    setfCount((prevCount) => prevCount + 10);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center relative">
      {showInfo && (
        <div className="absolute inset-0 z-50 bg-black bg-opacity-95 text-white flex items-center justify-center p-4">
        <div className="w-full text-center max-w-4xl font-roadrage font-extralight">
          <h2 className="text-6xl mb-4 tracking-wider">How to Play Miner Game</h2>
          <div className="text-xl mb-6 space-y-4 tracking-wider">
            <div>
              <strong>Basic Gameplay:</strong>
              <ul className="list-disc list-inside text-left">
                <li>Generate F$: Your miner automatically generates F$ over time.</li>
                <li>Speed Up Mining: Click on the miner to increase F$ generation speed.</li>
                <li>Upgrade Your Miner: Use F$ to upgrade your miner and boost its earning power.</li>
              </ul>
            </div>
            <div>
              <strong>Boosting Your Mining:</strong>
              <ul className="list-disc list-inside text-left">
                <li>SHAMY Token Boost: Use SHAMY tokens to significantly increase your F$ generation rate for a specific duration.</li>
                <li>F$ Boost: Use F$ to temporarily boost your mining speed.</li>
              </ul>
            </div>
            <div>
              <strong>Prize Draws:</strong>
              <ul className="list-disc list-inside text-left">
                <li>Eligibility: To participate in prize draws, you need to subscribe with 0.50 USDT.</li>
                <li>Additional Entries: Purchase additional entries for 50 million F$ to increase your chances of winning.</li>
                <li>Level Reset: If your level is above 25, it will be reset to a level 10 lower after a draw.</li>
              </ul>
            </div>
            <div>
              <strong>Remember:</strong> Keep mining, upgrading, and boosting to maximize your F$ earnings and increase your chances of winning exciting prizes!
            </div>
          </div>
          <button
            className="bg-white text-black py-2 px-6 rounded-lg"
            onClick={() => setShowInfo(false)}
          >
            Close
          </button>
        </div>
      </div>
      
      )}

      <div className="flex flex-col justify-between gap-7 font-roadrage py-4 items-center bg-gray-800 rounded-xl shadow-lg w-screen sm:w-[500px] min-h-screen sm:min-h-[calc(100vh-2rem)] sm:my-4 bg-gradient-to-t from-black to-transparent">
        <div className="flex gap-8 items-center">
          <div className="text-5xl text-goldenYellow uppercase">
            Level {level}
          </div>
          <button
            className="text-lg border-2 px-4 h-8 rounded-lg text-white font-extralight"
            onClick={() => setShowInfo(true)}
          >
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
        <div className="text-6xl text-goldenYellow">
          F$: {fCount.toFixed(2)}
        </div>
        <div className="bg-gray-600 h-4 rounded-full shadow-glow w-4/5 sm:my-2">
          <div
            className="bg-magentaPurple h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="mt-5">
          <FooterMain />
        </div>
      </div>
    </div>
  );
};

export default MainSection;
