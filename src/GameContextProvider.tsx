import { createContext, useState, useEffect, useMemo, ReactNode } from "react";
import { myConstants  , loginWithFirebase , registerWithFirebase , saveToFirebase, registerWithGoogleAuth} from "./config/config";
import { GameContext } from "./context/GameContext";
import { set } from "firebase/database";


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


export function Provider({ children }: ProviderProps) {
  const [storedData, setStoredData] = useState<GameData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [F$rate, setF$rate] = useState<number>(myConstants.F$rate);
  const [counter, setCount] = useState<number>(60);
  const [currentView, setCurrentView] = useState<string>("LoginPage");
  const [fCount, setfCount] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);


  const handleGoogleAuth = async() => {
    setIsLoading(true);
    const data = await registerWithGoogleAuth();
    if (data) {
      setUserId(data.userId);
      setfCount(data.fCount);
      setLevel(data.level);
      setCurrentView("MainSection");
    }
    setIsLoading(false);
    setIsLoggedIn(true);
  }
  
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    const data = await loginWithFirebase({ email, password });
    if (data) {
      setUserId(data.userId);
      setfCount(data.fCount);
      setLevel(data.level);
      setCurrentView("MainSection");
    }
    setIsLoading(false);
    setIsLoggedIn(true);
  };

  // Register a new user
  const handleRegister = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    await registerWithFirebase({ email, password, username });
    setCurrentView("LoginPage");
    setIsLoading(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (userId) {
        saveToFirebase({
          userId,
          userName: "DefaultUser", // Replace with dynamic name if needed
          fCount,
          level,
          lastUpdated: Date.now(),
        });
        console.log("Game data saved to Firebase.");
      }
    }, 60000); // Save every 60 seconds

    return () => clearInterval(interval);
  }, [fCount, level, userId]);

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
      setF$rate,
      handleLogin,
      handleRegister,
      handleGoogleAuth,
      isLoggedIn
    }),
    [fCount, level, myConstants, F$rate, levelupRate, isLoading]
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setfCount((prevCount) => prevCount + F$rate);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [level]);

  // useEffect(() => {
  //   setGameData({
  //     userId: 123,
  //     userName: "sasd",
  //     fCount: contextGameData.fCount,
  //     level: contextGameData.level,
  //     lastUpdated: Date.now(),
  //   });
  // }, [contextGameData]);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setCount((prevCount) => prevCount - 1);
  //   }, 1000);

  //   if (counter === 0) {
  //     saveGameData(gameData);
  //     setCount(60);
  //   }
  //   return () => clearTimeout(timeout);
  // }, [counter, gameData]);

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

