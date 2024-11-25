import React, { useContext, useEffect, useMemo, useState } from 'react';
import { GameContext } from '../context/GameContext';
import { levelMax } from "../constants/leveldata";

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

const Footer: React.FC = () => {
  const {
    fCount,
    level,
    levelupRate,
    myConstants,
    setfCount,
    setLevel,
    setCurrentView,
  } = useContext(GameContext) as GlobalContextProps;

  const updatelevel = () => {
    if(fCount > levelMax[level-1]){
      setLevel(level+1)
    }
  }

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

  return (
    <div className="fixed bottom-0 w-full bg-gray-900 text-white py-4 font-spicyrice">
      <div className="flex justify-evenly text-xl py-4">
        <button
          className={`p-2 rounded-lg w-32 ${
            fCount > levelMax[level-1]
              ? 'bg-vividGreen shadow-vividGreenGlow'
              : 'bg-charcoalGray shadow-charcoalGrayGlow'
          }`}
          onClick={updatelevel}
        >
          Upgrade
        </button>
        <button
          className="p-2 w-32 bg-royalBlue rounded-lg shadow-royalBlueGlow"
          onClick={() => setCurrentView('BoostPage')}
        >
          Boost
        </button>
        <button className="p-2 w-32 bg-magentaPurple rounded-lg shadow-glow ">
          Subscribe
        </button>
        <button className="p-2 w-32 bg-goldenYellow rounded-lg shadow-goldenGlow">
          Tasks
        </button>
      </div>
    </div>
  );
};

export default Footer;

function LevelUpCost(baseCost: number, levelUpRate: number, level: number): number {
  return baseCost * levelUpRate * (level + 1);
}
