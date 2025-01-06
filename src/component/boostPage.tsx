import React, { useRef, useState, useEffect, useContext, useMemo } from "react";
import { Validate } from "./hookFunctions";
import { GameContext } from "../context/GameContext";
import FooterMain from "./footerMain";
import SolanaConnection from "./SolanaConnection";
import * as walletAdapterReact from "@solana/wallet-adapter-react";
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { set } from "firebase/database";
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

  const handleClick = () => {
    if (fCount >= 500000) {
      alert("Boost applied successfully");
      setAppliedBoost(true);

      // Deduct F$ and apply the boost
      setfCount(fCount - 500000);
      applyBoost();

      // Start the countdown for the boost duration
      let timeLeft = 3600000; // 1 hour
      const interval = setInterval(() => {
        timeLeft -= 1000; // Reduce time by 1 second
        setRemainingTime(timeLeft);

        if (timeLeft <= 0) {
          clearInterval(interval);
          removeBoost();
          alert("Boost has ended");
          setAppliedBoost(false);
        }
      }, 1000);
    } else {
      alert("Not enough F$ to boost");
    }
  };

  const applyBoost = () => {
    setF$rate(currentRate => currentRate * 2);
  };
  const removeBoost = () => {
    setF$rate(currentRate => currentRate / 2);
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
            <div className="flex flex-col justify-between gap-7 font-roadrage py-4 items-center bg-gray-800 rounded-xl shadow-lg w-screen sm:w-[500px] min-h-screen sm:min-h-[calc(100vh-2rem)] sm:my-4 bg-gradient-to-t from-black to-transparent">
              <div className="flex flex-col justify-center items-center w-full">
                <SolanaConnection />
              </div>

              <div className="text-6xl font-medium font-roadrage text-goldenYellow">
                Total F$: {fCount.toFixed(2)}
              </div>

              <div className="flex flex-col justify-between w-[300px]">
                <div className="text-center">
                  <p className="text-white text-xl p-3">
                    Boost Using F$ <br /> For F$ 500,000 a 2X boost will be
                    applied for 1 Hr
                  </p>
                  <div className="flex justify-center mt-8">
                    <button
                      className="bg-green-700 text-white px-8 py-3 rounded text-3xl"
                      onClick={handleClick}
                    >
                      F$ : 500,000
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
              <div>
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