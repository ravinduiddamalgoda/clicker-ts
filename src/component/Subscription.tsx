import React, { useState, useContext, useEffect } from "react";
import SolanaConnection from "./SolanaConnection";
import * as walletAdapterReact from "@solana/wallet-adapter-react";
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { GameContext } from "../context/GameContext";
import StripeButton from "./PayWithStripe";

import { myConstants } from "../config/config";
import FooterMain from "./footerMain";

interface GlobalContextProps {
    fCount: number;
    setfCount: React.Dispatch<React.SetStateAction<number>>;
    currentView: string;
    setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}

const Subscription = () => {   
    const { fCount, setfCount } = useContext(GameContext) as GlobalContextProps;
    const [subscriptionStatus, setSubscriptionStatus] = useState(false);
    const [additionalEntries, setAdditionalEntries] = useState(0);
    const [transactionHash, setTransactionHash] = useState<string | null>(null);

    const gameUSDTAddress = "7ZHcBghNEo8mLgam2qXhzBfpnvZDxJiJMZJs1upXAU4V"; // Replace with your USDT address
    const entryCost = myConstants.Additional_entryCost; // F$ cost per additional entry

    const handleUSDTSubscription = async () => {
        try {
            // Integration with a cryptocurrency payment gateway
            const result = await initiateUSDTTransaction(gameUSDTAddress, 10); // $10 USDT
            if (result.success && result.txHash) {
                setTransactionHash(result.txHash);
                setSubscriptionStatus(true);
                alert("Subscription successful!");
            } else {
                alert("Transaction failed. Please try again.");
            }
        } catch (error) {
            console.error("Error processing subscription:", error);
            alert("Subscription failed.");
        }
    };

    const handlePurchaseEntry = () => {
        if (!subscriptionStatus) {
            alert("Complete your subscription first!");
            return;
        }

        if (fCount < entryCost) {
            alert("Insufficient F$ balance.");
            return;
        }

        setfCount(fCount - entryCost);
        setAdditionalEntries((prev) => prev + 1);
        alert("Additional entry purchased successfully!");
    };
    const endpoint ="https://fittest-falling-yard.solana-mainnet.quiknode.pro/ef9c6c4f493c90e3c52d95a11c5cf76f8a14def6";
    const wallets = [new walletAdapterWallets.PhantomWalletAdapter()];

   
    return (

        <walletAdapterReact.ConnectionProvider endpoint={endpoint}>
        <walletAdapterReact.WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
  
        <div className="flex flex-col w-full items-center justify-center text-center">
        <div className="flex flex-row  justify-center pb-2  ">
                 fgggsdfdsgdfg
            </div> 
            
            <div className="flex flex-row  justify-center pb-2  ">
                 <SolanaConnection />
            </div>  
            <div className="flex flex-row  justify-center pb-2">
            <StripeButton/>
                
            </div> 
            <div className="flex flex-row  justify-center ">
            
                <button> Pay with F$ </button>
            </div> 
            
                

                <div className="flex w-full justify-center rounded-md mt-1">

                    {/* <h2 className="text-lg text-blue-400">USDT Subscription</h2>
                    <p className="text-white">Subscribe for $10 USDT to unlock features.</p>
                    <button
                        onClick={handleUSDTSubscription}
                        className={`mt-2 px-4 py-2 rounded ${subscriptionStatus ? "bg-gray-500 cursor-not-allowed" : "bg-green-500"
                            }`}
                        disabled={subscriptionStatus}
                    >
                        {subscriptionStatus ? "Subscribed" : "Subscribe"}
                    </button> */}
                </div>
                

                {/* Entry Purchase Section
                <div className="mt-2 mb-2">
                   <p className="text-white text-sm">Play to WIN!!. Just subscribe 0.50 USDT to Enter the draw.</p>
                   
                   <button className=" px-4 py-2 rounded  bg-green-400"
                    onClick={() => setShowDetails(true)} > Details</button> */}

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
                {/* </div> */}

                {/* Transaction Details */}
                {transactionHash && (
                    <div className="mt-4 text-gray-300">
                        <p>Transaction Hash:</p>
                        <a
                            href={`https://solscan.io/tx/${transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline"
                        >
                            {transactionHash}
                        </a>
                    </div>
                )}
           
        </div>
    </WalletModalProvider>
    </walletAdapterReact.WalletProvider>
    </walletAdapterReact.ConnectionProvider>
    );
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

export default Subscription;