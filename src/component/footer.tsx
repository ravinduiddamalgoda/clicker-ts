import React, { useContext, useEffect, useMemo, useState } from 'react';
import { GameContext } from '../context/GameContext';

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
    <div className="fixed bottom-0 w-full bg-gray-900 text-white py-4">
      <div className="flex justify-evenly">
        <button
          className={`p-2 rounded-lg ${
            enoughF$
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gray-600 cursor-not-allowed'
          }`}
          onClick={handleLevelUpgrade}
        >
          Upgrade
        </button>
        <button
          className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600"
          onClick={() => setCurrentView('BoostPage')}
        >
          Boost
        </button>
        <button className="p-2 bg-purple-500 rounded-lg hover:bg-purple-600">
          Subscribe
        </button>
        <button className="p-2 bg-orange-500 rounded-lg hover:bg-orange-600">
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
