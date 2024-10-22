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