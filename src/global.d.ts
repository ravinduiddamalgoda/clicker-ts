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
}
export interface GlobalContextProps {
  fCount: number;
  level: number;
  levelupRate: number;
  isLoading : boolean;
  myConstants: {
    miner_base_cost: number;
  };
  setfCount: React.Dispatch<React.SetStateAction<number>>;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  currentView: string;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}
