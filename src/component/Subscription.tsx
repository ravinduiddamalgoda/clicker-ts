import React, { useState, useContext, useEffect } from "react";
import { GameContext } from "../context/GameContext";
import { myConstants } from "../config/config";

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
    const entryCost = 5000000; // F$ cost per additional entry

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

    return (
        <div className="flex flex-col items-center justify-center text-center p-4 bg-gray-800 rounded-lg shadow-lg">
            <h1 className="text-xl font-bold text-white">Subscription & Entries</h1>
            
            {/* Subscription Section */}
            <div className="mt-4">
                <h2 className="text-lg text-blue-400">USDT Subscription</h2>
                <p className="text-white">Subscribe for $10 USDT to unlock features.</p>
                <button
                    onClick={handleUSDTSubscription}
                    className={`mt-2 px-4 py-2 rounded ${
                        subscriptionStatus ? "bg-gray-500 cursor-not-allowed" : "bg-green-500"
                    }`}
                    disabled={subscriptionStatus}
                >
                    {subscriptionStatus ? "Subscribed" : "Subscribe"}
                </button>
            </div>

            {/* Entry Purchase Section */}
            <div className="mt-8">
                <h2 className="text-lg text-blue-400">Additional Entries</h2>
                <p className="text-white">Each entry costs 5,000,000 F$.</p>
                <button
                    onClick={handlePurchaseEntry}
                    className={`mt-2 px-4 py-2 rounded ${
                        fCount >= entryCost ? "bg-indigo-600" : "bg-gray-500 cursor-not-allowed"
                    }`}
                    disabled={fCount < entryCost}
                >
                    Purchase Entry
                </button>
                <p className="mt-2 text-green-400">
                    Entries Purchased: {additionalEntries}
                </p>
            </div>

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
