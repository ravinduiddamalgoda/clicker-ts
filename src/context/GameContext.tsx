
import { createContext } from "react";
import { myConstants } from "../config/config";

interface GameData {
  userId: number;
  userName: string;
  fCount: number;
  level: number;
  lastUpdated: number;
}

interface ContextGameData {
  fCount: number;
  level: number;
  myConstants: typeof myConstants;
  F$rate: number;
  levelupRate: number;
  isLoading: boolean;
  currentView: string;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  setfCount: React.Dispatch<React.SetStateAction<number>>;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  setF$rate: React.Dispatch<React.SetStateAction<number>>;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleRegister: (email: string, password: string, username: string) => Promise<void>;
  handleGoogleAuth: () =>  Promise<void>;
  isLoggedIn: boolean;
  // setLevelupRate: React.Dispatch<React.SetStateAction<number>>; 
}

export const GameContext = createContext<ContextGameData | undefined>(undefined);