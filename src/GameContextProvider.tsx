import { createContext, useState, useEffect, useMemo, ReactNode } from "react";
import { myConstants } from "./config/config";
import { GameContext } from "./context/GameContext";

interface GameData {
  userId: number;
  userName: string;
  fCount: number;
  level: number;
  lastUpdated: number;
}
interface ProviderProps {
  children: ReactNode;
}


function Provider({ children }: ProviderProps) {
  const [storedData, setStoredData] = useState<GameData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [F$rate, setF$rate] = useState<number>(myConstants.F$rate);
  const [counter, setCount] = useState<number>(60);
  const [currentView, setCurrentView] = useState<string>("MainSection");
  const [fCount, setfCount] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGameData();
        setIsLoading(false);
        setStoredData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (storedData) {
      setfCount(storedData.fCount || 0);
      setLevel(storedData.level || 1);
    }
  }, [storedData]);

  useEffect(() => {
    const rate = myConstants.F$rate * Math.pow(1 + myConstants.Growth_rate_per_level, level - 1);
    setF$rate(rate);
  }, [level]);

  const levelupRate = useMemo(() => level + myConstants.level_up_base_multiplier, [level, myConstants]);

  const contextGameData = useMemo(
    () => ({
      fCount,
      level,
      myConstants,
      F$rate,
      levelupRate,
      isLoading,
      currentView,
      setCurrentView,
      setfCount,
      setLevel,
    }),
    [fCount, level, myConstants, F$rate, levelupRate, isLoading]
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setfCount((prevCount) => prevCount + F$rate);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [level]);

  useEffect(() => {
    setGameData({
      userId: 123,
      userName: "sasd",
      fCount: contextGameData.fCount,
      level: contextGameData.level,
      lastUpdated: Date.now(),
    });
  }, [contextGameData]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    if (counter === 0) {
      saveGameData(gameData);
      setCount(60);
    }
    return () => clearTimeout(timeout);
  }, [counter, gameData]);

  return (
    <GameContext.Provider value={contextGameData}>{children}</GameContext.Provider>
  );
  
}


function getGameData(): GameData | null {
  const data = localStorage.getItem("gameData") || "[]";
  const adata = JSON.parse(data) as GameData;

  const elapsedTime = Date.now() - adata.lastUpdated;
  const additionalGold = Math.floor(elapsedTime / 1000);

  return adata;
}

function saveGameData(gameData: GameData | null): void {
  if (gameData) {
    localStorage.setItem("gameData", JSON.stringify(gameData));
  }
}

