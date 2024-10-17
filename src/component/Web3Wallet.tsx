import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const Web3Wallet: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [balance, setBalance] = useState<string>("");

  // Check if MetaMask is installed
  const checkIfWalletIsInstalled = () => {
    if (window.ethereum) {
      return true;
    } else {
      alert("MetaMask is not installed. Please install MetaMask to use this app.");
      return false;
    }
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (checkIfWalletIsInstalled()) {
      try {
        // Create an instance of Web3Provider
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        setProvider(provider);

        // Request account access
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);

        // Get the user's balance
        const balance = await provider.getBalance(accounts[0]);
        setBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    }
  };

  useEffect(() => {
    if (account && provider) {
      // If the account is already connected, update the balance
      provider.getBalance(account).then((balance) => {
        setBalance(ethers.utils.formatEther(balance));
      });
    }
  }, [account, provider]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Web3 Wallet Integration</h1>
      {account ? (
        <div className="bg-white p-6 rounded shadow-md text-center">
          <p>Connected Account: {account}</p>
          <p>Balance: {balance} ETH</p>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Connect MetaMask
        </button>
      )}
    </div>
  );
};

export default Web3Wallet;
