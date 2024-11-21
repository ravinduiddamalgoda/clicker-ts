import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

// Define the context properties for type safety
interface GlobalContextProps {
  level: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
}

const MainSection: React.FC = () => {
  const { level } = useContext(GameContext) as GlobalContextProps;

  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      <div className="flex flex-col items-center bg-gray-800 p-6 rounded-xl shadow-lg w-80">
        <img
          src="/path/to/icon.png"
          alt="Game Icon"
          className="h-20 w-20 mb-4 rounded-full bg-gray-700 p-2"
        />
        <h1 className="text-4xl font-bold text-white">Level: {level}</h1>
        <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
          Start
        </button>
      </div>
    </div>
  );
};

export default MainSection;
