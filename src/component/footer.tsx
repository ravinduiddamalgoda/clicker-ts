// import React, { useState, useEffect, useContext, useMemo } from 'react';
// import globalContext from '../globalContext';

// // Define the props for the context values
// interface GlobalContextProps {
//   fCount: number;
//   level: number;
//   levelupRate: number;
//   myConstants: {
//     miner_base_cost: number;
//   };
//   setfCount: React.Dispatch<React.SetStateAction<number>>;
//   setLevel: React.Dispatch<React.SetStateAction<number>>;
//   currentView: string;
//   setCurrentView: React.Dispatch<React.SetStateAction<string>>;
// }

// const Footer: React.FC = () => {
//   const {
//     fCount,
//     level,
//     levelupRate,
//     myConstants,
//     setfCount,
//     setLevel,
//     currentView,
//     setCurrentView,
//   } = useContext(globalContext) as GlobalContextProps;

//   const [enoughF$, setEnoughF$] = useState<boolean>(false);

//   const requiredF$ = useMemo(() => {
//     return LevelUpCost(myConstants.miner_base_cost, levelupRate, level);
//   }, [myConstants.miner_base_cost, levelupRate, level]);

//   const handleLevelUpgrade = () => {
//     if (enoughF$) {
//       setLevel(level + 1);
//       setfCount(fCount - requiredF$);
//     }
//   };

//   const handleViewClick = (view: string) => {
//     setCurrentView(view);
//   };

//   useEffect(() => {
//     setEnoughF$(fCount >= requiredF$);
//   }, [fCount, level]);

//   return (
//     <div className="flex justify-evenly items-center w-full">
//       <div
//         className={`flex-1 text-center p-2 border border-gray-300 rounded cursor-pointer ${
//           enoughF$ ? '' : 'bg-gray-400 cursor-not-allowed opacity-60'
//         }`}
//         onClick={handleLevelUpgrade}
//       >
//         Upgrade
//       </div>
//       <div
//         className="flex-1 text-center p-2 border border-gray-300 rounded cursor-pointer"
//         onClick={() => handleViewClick('BoostPage')}
//       >
//         Boost
//       </div>
//       <div className="flex-1 text-center p-2 border border-gray-300 rounded cursor-pointer">
//         Subscribe
//       </div>
//       <div className="flex-1 text-center p-2 border border-gray-300 rounded cursor-pointer">
//         Tasks
//       </div>
//     </div>
//   );
// };

// export default Footer;

// function LevelUpCost(baseCost: number, levelUpRate: number, level: number): number {
//   return baseCost * levelUpRate * (level + 1);
// }
export {};