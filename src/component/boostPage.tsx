import React, { useRef, useState, useEffect, useContext } from 'react';
import { Validate } from './hookFunctions';
import { GameContext } from '../context/GameContext';

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
    };
    setfCount: React.Dispatch<React.SetStateAction<number>>;
    setLevel: React.Dispatch<React.SetStateAction<number>>;
    currentView: string;
    setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  }

const BoostPage: React.FC = () => {
  const { setCurrentView } = useContext(GameContext) as GlobalContextProps;
  const [shamyWallet, setShamyWallet] = useState<ShamyWalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [inputValue, setInputValue] = useState<string>('');
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
        console.error('Error fetching data:', error);
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

  return (
    <div className="flex flex-col items-center w-full h-full p-5">
      <div className="grid grid-rows-2 h-full w-full gap-5">
        <div className="border border-black flex flex-col justify-start p-5">
          <div className="flex flex-col items-start w-full">
            <div className="text-left">
              <p>Your Current Balance:</p>
              <p className="font-bold" id="current-balance">
                {isLoading ? 0 : shamyWallet?.shamyBalance} SHAMY
              </p>
              <div className="mt-5">
                <input
                  type="number"
                  id="add-amount"
                  placeholder="Enter amount to Add"
                  value={inputValue}
                  onChange={handleOnChange}
                  className="border rounded px-3 py-2 w-full"
                />
                {!isValid && <p className="text-red-500">Please enter a valid number.</p>}
                <br />
                <button className="bg-gray-700 text-white px-4 py-2 mt-2 rounded">Add Tokens</button>
              </div>
            </div>
          </div>
          <div className="ml-auto absolute top-0 right-0 mt-5 mr-5">
            {/* Top right button placeholder */}
          </div>
        </div>

        <div className="border border-black flex flex-col justify-between p-5">
          <div className="text-left">
            <p>
              Boost Using F$ <br /> For F$ 500,000 a X5 boost will be applied for 1 Hr
            </p>
            <div className="flex justify-end">
              <button className="bg-green-700 text-white px-4 py-2 rounded">F$ : 500,000</button>
            </div>
          </div>
        </div>
      </div>
      <button className="mt-5 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleViewChange('MainSection')}>
        Click
      </button>
      <h1 className="text-2xl font-bold mt-5">Boost</h1>
    </div>
  );
};

export { BoostPage };

function getShamyData(): ShamyWalletData | null {
  const dataString = localStorage.getItem('shamyData');
  let data: ShamyWalletData | null = null;

  if (dataString) {
    try {
      data = JSON.parse(dataString);
    } catch (error) {
      console.error('Error parsing shamyData:', error);
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
  localStorage.setItem('shamyData', JSON.stringify(shamyData));
}
// export {};