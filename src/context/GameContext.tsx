
import React, { createContext } from "react";
import { myConstants } from "../config/config";

interface GameData {
  userId: number;
  userName: string;
  fCount: number;
  level: number;
  lastUpdated: number;
  completedTasks: Record<string, number>;
}

interface Task {
  id: number;
  target: number;
  category: string;
  startTime: number; // start time
  rate: number; // F$rate at the time task is started
  progress: number;
}

interface ActiveTaskArray {
  task: Task;

}


interface ContextGameData {
  userId: string,
  fCount: number;
  level: number;
  myConstants: typeof myConstants;
  F$rate: number;
 // levelupRate: number;
  isLoading: boolean;
  currentView: string;
  message: string;
  showMessage: boolean;
  completedTasks: Record<string, number>;
  activeTaskArray: ActiveTaskArray[]; 
  referalLink: string;
//  referralCode: string; // code receieved through the link
 
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setShowMessage:React.Dispatch<React.SetStateAction<boolean>>;
  setfCount: React.Dispatch<React.SetStateAction<number>>;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  setF$rate: React.Dispatch<React.SetStateAction<number>>;
  handleLogin: (email: string) => Promise<void>;
 // handleRegister: (email: string, password: string, username: string) => Promise<void>;
  handleGoogleAuth: () =>  Promise<void>;
  handleLogout: () =>  Promise<void>;
  setCompletedTasks: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setActiveTaskArray: React.Dispatch<React.SetStateAction<ActiveTaskArray[]>>;
  isDraw: boolean;
  setIsDraw: React.Dispatch<React.SetStateAction<boolean>>;
 
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>; 
  setReferalLink: React.Dispatch<React.SetStateAction<string>>;
  
  // setLevelupRate: React.Dispatch<React.SetStateAction<number>>; 
}

export const GameContext = createContext<ContextGameData | undefined>(undefined);