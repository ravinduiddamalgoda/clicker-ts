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
    F$_Multiplier : number;
  };
  setfCount: React.Dispatch<React.SetStateAction<number>>;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  currentView: string;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  setF$rate: React.Dispatch<React.SetStateAction<number>>;
}

const BoostPage: React.FC = () => {
  const { setCurrentView } = useContext(GameContext) as GlobalContextProps;
  const { fCount ,setfCount , levelupRate } = useContext(GameContext) as GlobalContextProps;
  const {setF$rate} = useContext(GameContext) as GlobalContextProps;
  const [shamyWallet, setShamyWallet] = useState<ShamyWalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [inputValue, setInputValue] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);

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
        // Deduct the F$ from the user's account
        setfCount(fCount - 500000);

        // Apply the boost
        applyBoost();

        // Set a timeout to remove the boost after one hour
        setTimeout(() => {
            removeBoost();
            alert("Boost has ended");
        }, 3600000); // 3600000 milliseconds = 1 hour
    } else {
        alert("Not enough F$ to boost");
    }
}

const applyBoost = () => {
   setF$rate(currentRate => currentRate * 2);
};
const removeBoost = () => {
  setF$rate(currentRate => currentRate / 2);
}
  const endpoint =
    "https://fittest-falling-yard.solana-mainnet.quiknode.pro/ef9c6c4f493c90e3c52d95a11c5cf76f8a14def6";
  const wallets = [new walletAdapterWallets.PhantomWalletAdapter()];
  return (
    <walletAdapterReact.ConnectionProvider endpoint={endpoint}>
      <walletAdapterReact.WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="flex flex-col items-center justify-center h-screen sm:h-[800px]">
            <div className="flex flex-col items-center justify-center gap-14 bg-gray-800 rounded-xl shadow-lg w-screen sm:w-[500px] min-h-screen">
              <div className="flex flex-col justify-center items-center w-full">
                <SolanaConnection />
              </div>

              <div className="flex flex-col justify-between w-[300px]">
                <div className="text-left">
                  <p className="text-white">
                    Boost Using F$ <br /> For F$ 500,000 a 2X boost will be
                    applied for 1 Hr
                  </p>
                  <div className="flex justify-end mt-2">
                    <button className="bg-green-700 text-white px-4 py-2 rounded" onClick={handleClick}>
                      F$ : 500,000
                    </button>
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
// export {};
