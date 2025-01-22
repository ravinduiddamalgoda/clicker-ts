import React, { useRef, useState, useEffect, useContext, useMemo } from "react";
import { Validate } from "./hookFunctions";
import { GameContext } from "../context/GameContext";
import FooterMain from "./footerMain";
import SolanaConnection from "./SolanaConnection";
import * as walletAdapterReact from "@solana/wallet-adapter-react";
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { myConstants} from "../config/config";
require("@solana/wallet-adapter-react-ui/styles.css");
// Type definition for Shamy Wallet data
interface ShamyWalletData {
  userId: number;
  shamyBalance: number;
}

interface GlobalContextProps {
  fCount: number;
  level: number;
  levelupRate: number;
  myConstants: {
    miner_base_cost: number;
    F$_Multiplier: number;
  };
  setfCount: React.Dispatch<React.SetStateAction<number>>;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  currentView: string;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  setF$rate: React.Dispatch<React.SetStateAction<number>>;
}

const BoostPage: React.FC = () => {
  const { setCurrentView } = useContext(GameContext) as GlobalContextProps;
  const { fCount, setfCount, levelupRate } = useContext(GameContext) as GlobalContextProps;
  const { setF$rate } = useContext(GameContext) as GlobalContextProps;
  const [shamyWallet, setShamyWallet] = useState<ShamyWalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [inputValue, setInputValue] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);
  const [aapliedBoost, setAppliedBoost] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(3600000);

  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const validationResult = Validate(value); // Call the Validate component
    setInputValue(value);
    setIsValid(validationResult);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getShamyData();
        if (data) {
          setShamyWallet(data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (shamyWallet) {
      saveShamyData(shamyWallet);
    }
  }, [shamyWallet]);

  const handleBoostF$ = () => {
    if (fCount >= myConstants.F$_boost) {
      
      setMessage(pre=> pre = "Boost applied successfully");
      setShowMessage(true);
      setAppliedBoost(true);

      // Deduct F$ and apply the boost
      setfCount(fCount - myConstants.F$_boost);
      applyBoost();

      // Start the countdown for the boost duration
      let timeLeft = 3600000; // 1 hour
      const interval = setInterval(() => {
        timeLeft -= 1000; // Reduce time by 1 second
        setRemainingTime(timeLeft);

        if (timeLeft <= 0) {
          clearInterval(interval);
          removeBoost();          
          setMessage(pre=> pre = "Boost has ended");
          setShowMessage(true);
          setAppliedBoost(false);
        }
      }, 1000);
    } else {
      
      setMessage(pre=> pre = "Not enough F$ to boost");
      setShowMessage(true);
      
    }
  };

  const applyBoost = () => {
    setF$rate(currentRate => currentRate * myConstants.F$_Multiplier);
  };
  const removeBoost = () => {
    setF$rate(currentRate => currentRate / myConstants.F$_Multiplier);
  }
  const progressPercentage = ((3600000 - remainingTime) / 3600000) * 100; // Calculate progress percentage
  
  const endpoint =
    "https://fittest-falling-yard.solana-mainnet.quiknode.pro/ef9c6c4f493c90e3c52d95a11c5cf76f8a14def6";
  const wallets = [new walletAdapterWallets.PhantomWalletAdapter()];
  return (
    <walletAdapterReact.ConnectionProvider endpoint={endpoint}>
      <walletAdapterReact.WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="flex flex-col items-center justify-center text-center">
          {showMessage && (
             <div className="absolute inset-0 z-50 bg-black bg-opacity-95 text-white flex items-center justify-center p-2">
                <div className="w-full rounded w-[400px] p-2 bg-blue-700 text-center max-w-4xl font-roadrage font-extralight">
                    <div >
                            <div className=" flex flex-row rounded bg-blue-700 w-[370px] p-5 ">                        
                                <div className="text-xl mb-6 space-y-4 tracking-wider">{message}</div>
                        
                                <button
                                    className="bg-white text-black py-2 px-6 rounded-sm"
                                    onClick={() => setShowMessage(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                </div>
            </div>
             )}
            <div className="flex flex-col justify-between gap-7 font-roadrage py-4 items-center bg-gray-800 rounded-xl shadow-lg max-h-[600px] w-screen sm:w-[400px] min-h-screen sm:min-h-[calc(100vh-2rem)] sm:my-4 bg-gradient-to-t from-black to-transparent">
             
              <div className="flex flex-row justify-between  w-full">
                    <SolanaConnection />
                  </div>  
              

              <div className="flex w-full justify-center border-t border-gray-600 text-xl font-medium ">
                <p className="text-white text-xl p-3">
                    Boost with F$ <br /> Boost F$ generations X5 for 1 Hour
                </p>
              </div>

              <div className="flex flex-col justify-between w-[300px]">
                <div className="text-3xl text-goldenYellow">
                  F$: {fCount /*toFixed(2)*/}
                </div>

                <div className="text-center">                  
                  <div className="flex justify-center mt-8">
                    <button
                      className={` text-white px-8 py-3 rounded text-3xl ${ fCount<myConstants.F$_boost ? 'bg-gray-600 cursor-not-allowed':'bg-green-700'}`}
                      onClick={handleBoostF$}
                      disabled = { fCount< myConstants.F$_boost}
                    >
                      F$ : {myConstants.F$_boost}
                    </button>
                    {aapliedBoost && (
                    <div className="bg-gray-600 h-4 rounded-full shadow-glow w-full mt-4">
                      <div
                        className="bg-magentaPurple h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  )}
                  </div>
                </div>
              </div>
              <div className="flex-none w-full items-center p-2">
                <FooterMain />
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </walletAdapterReact.WalletProvider>
    </walletAdapterReact.ConnectionProvider>
  );
};

export { BoostPage };

function getShamyData(): ShamyWalletData | null {
  const dataString = localStorage.getItem("shamyData");
  let data: ShamyWalletData | null = null;

  if (dataString) {
    try {
      data = JSON.parse(dataString);
    } catch (error) {
      console.error("Error parsing shamyData:", error);
    }
  } else {
    data = { userId: 123, shamyBalance: 0 };
  }
  if (data === null) {
    data = { userId: 123, shamyBalance: 0 };
  }

  return data;
}

function saveShamyData(shamyData: ShamyWalletData): void {
  localStorage.setItem("shamyData", JSON.stringify(shamyData));
}