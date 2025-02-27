// src/global.d.ts
interface Window {
  ethereum?: {
    isMetaMask?: true;
    request: (...args: any[]) => Promise<any>;
    on?: (event: string, callback: (...args: any[]) => void) => void;
  };
}

export interface GameData {
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

export interface GlobalContextProps {
  F$rate: number;
  userId: string;
  fCount: number;
  level: number;
 // levelupRate: number;
  isLoading : boolean;
  myConstants: {
    miner_base_cost: number;
  };
  
  referalLink: string;
  setReferalLink: React.Dispatch<React.SetStateAction<string>>;
  setfCount: React.Dispatch<React.SetStateAction<number>>;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  currentView: string;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  showMessage: boolean;
  setShowMessage:React.Dispatch<React.SetStateAction<boolean>>;  
  completedTasks: Record<string, number>;
  setCompletedTasks: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  activeTaskArray: ActiveTaskArray[];
  setActiveTaskArray: React.Dispatch<React.SetStateAction<ActiveTaskArray[]>>;
  
}
