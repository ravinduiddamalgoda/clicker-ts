import React, { useState, useContext, useEffect } from "react";
import { GameContext } from "../context/GameContext";
import WinDetails from "./winDetails";// game play details
import MainImage from "../assets/icons/winmainImage.png";
import Draw from "./draw";




interface GlobalContextProps {
isDraw: boolean;
setIsDraw: React.Dispatch<React.SetStateAction<boolean>>;
  }



const PlaytoWin:  React.FC = () => {
    const {isDraw, setIsDraw } = useContext(GameContext) as GlobalContextProps;
    const [showDetails, setShowDetails] = useState(false);


   
    
    
    const handleCloseButton = () =>{
        setShowDetails(false);        
      }


    if(isDraw){
        return(<>
         <Draw />
        </>)
       
    }else{


    return (
      <>
        {showDetails && (<>
            <div className="flex flex-col w-screen sm:w-[400px] items-center justify-center">
              <WinDetails onButtonClick={handleCloseButton}/>                   
            </div>
          </>)}
        {/* {activeDraw ? (<Subscription/>) : display the standard code} */}

        <div className="flex flex-col w-full items-center justify-center text-center">
        <div className="flex w-full justify-center rounded-md text-white p-1">
        Next Draw Coming Soon!! </div>
                <div className="flex w-full justify-center rounded-md mt-2">
                
                <img src={MainImage} alt="Home Icon" className=" rounded-md object-contain glow" />
                    
                </div>
                
                {/* Entry Purchase Section */}
                <div className="justify-center tracking-wider text-seablue mt-2 mb-2">
                <p>"Imagine a fun treasure hunt!</p><p className="text-xm"> Instead of digging for gold, 
                    enter exciting draws to win amazing prizes like the latest phones, stylish watches, 
                    and even real gold!!!  Join, MINE F$ and get more entries to WIN!!<br/> 
                    It's like a lottery, but with a touch of adventure!"</p>
                   <p className="text-white text-sm">Play to WIN!!. Join with 0.50 USDT to Enter the draw.</p>
                   
                   <button className=" text-white px-4 py-2 rounded  bg-green-400"
                    onClick={() => setShowDetails(true)} > Details</button>

                    {/* <button
                        onClick={handlePurchaseEntry}
                        className={`mt-2 px-4 py-2 rounded ${fCount >= entryCost ? "bg-indigo-600" : "bg-gray-500 cursor-not-allowed"
                            }`}
                        disabled={fCount < entryCost}
                    >
                        Purchase Entry
                    </button>
                    <p className="mt-2 text-green-400">
                        Entries Purchased: {additionalEntries}
                    </p> */}
                </div>

           
        </div>
   
  </>  );
    }
};

async function initiateUSDTTransaction(walletAddress: string, amount: number) {
    try {
        // Mock transaction call (replace with gateway integration)
        console.log(`Sending ${amount} USDT to ${walletAddress}`);
        return { success: true, txHash: "mock-transaction-hash" };
    } catch (error) {
        console.error("Transaction error:", error);
        return { success: false };
    }
}

export default PlaytoWin;