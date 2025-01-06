import React, { useContext, useEffect, useMemo, useState } from "react";
import { GameContext } from "../context/GameContext";
import { levelMax } from "../constants/leveldata";
import Upgrade from '../assets/icons/upgrade.png'
import Boost from '../assets/icons/boost.png'
import Click from '../assets/icons/clicks.png'
import Home from '../assets/icons/home.png'
import Logout from '../assets/icons/logout.png'
import Task from '../assets/icons/task.png'

interface GlobalContextProps {
  fCount: number;
  level: number;
  levelupRate: number;
  myConstants: {
    miner_base_cost: number;
  };
  setfCount: React.Dispatch<React.SetStateAction<number>>;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  currentView: string;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}

const FooterMain: React.FC = () => {
  const {
    fCount,
    level,
    levelupRate,
    myConstants,
    currentView,
    setfCount,
    setLevel,
    setCurrentView,
  } = useContext(GameContext) as GlobalContextProps;

  const updatelevel = () => {
    if (fCount > levelMax[level - 1]) {
      setLevel(level + 1);
    } else {
      alert("Not enough F$ to upgrade ;-)");
    }
  };

  const [enoughF$, setEnoughF$] = useState(false);

  const requiredF$ = useMemo(
    () => LevelUpCost(myConstants.miner_base_cost, levelupRate, level),
    [myConstants.miner_base_cost, levelupRate, level]
  );

  const handleLevelUpgrade = () => {
    if (enoughF$) {
      setLevel(level + 1);
      setfCount(fCount - requiredF$);
    }
  };

  useEffect(() => {
    setEnoughF$(fCount >= requiredF$);
  }, [fCount, level, requiredF$]);

  const logout = () => {
    localStorage.removeItem("userId");
    window.location.reload();
  }
  return (
    <div className="text-white font-roadrage max-w-[400px]">
      <div
        className="flex justify-evenly text-xl px-2 py-4 gap-3 overflow-x-auto bg-darkwine rounded-3xl"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {currentView !== "MainSection" && (
          <button
            className="px-6 rounded-lg text-xl"
            onClick={() => setCurrentView("MainSection")}
            style={{
              textShadow: "0 0 1px black"
            }}
          >
            <img src={Home} alt="Home Icon" className="w-12 h-12 object-contain" />
            Home
          </button>
        )}
        <button
          className="px-6 rounded-lg text-xl"
          onClick={updatelevel}
          style={{
            textShadow: "0 0 1px black"
          }}
        >
          <img src={Upgrade} alt="Upgrade Icon" className="w-12 h-12 object-contain" />
          Upgrade
        </button>
        <button
          className="px-6 rounded-lg text-xl"
          onClick={() => setCurrentView("BoostPage")}
          style={{
            textShadow: "0 0 1px black"
          }}
        >
          <img src={Boost} alt="Boost Icon" className="w-12 h-12 object-contain" />
          Boost
        </button>
        <button
          className="px-6 rounded-lg text-xl"
          style={{
            textShadow: "0 0 1px black"
          }}
        >
          <img src={Click} alt="Click Icon" className="w-12 h-12 object-contain" />
          Subscribe
        </button>
        <button
          className="px-6 rounded-lg text-xl"
          onClick={() => setCurrentView("TaskPage")}
          style={{
            textShadow: "0 0 1px black"
          }}
        >
          <img src={Task} alt="Task Icon" className="w-12 h-12 object-contain" />
          Tasks
        </button>
        <button
          className="px-6 rounded-lg text-xl"
          onClick={() => logout()}
          style={{
            textShadow: "0 0 1px black"
          }}
        >
          <img src={Logout} alt="Logout Icon" className="w-12 h-12 object-contain" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default FooterMain;

function LevelUpCost(baseCost: number, levelUpRate: number, level: number): number {
  return baseCost * levelUpRate * (level + 1);
}
