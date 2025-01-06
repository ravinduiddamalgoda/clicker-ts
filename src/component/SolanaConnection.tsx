import * as React from 'react';
import * as web3 from '@solana/web3.js';
import * as walletAdapterReact from '@solana/wallet-adapter-react'; 
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
    createTransferInstruction,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import '@solana/wallet-adapter-react-ui/styles.css';
import { GameContext } from '../context/GameContext';

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
  
const SolanaConnection = () => {
    const [balance, setBalance] = React.useState<number | null>(0);
    const [shamyBalance, setShamyBalance] = React.useState<number | null>(0);
    const [amount, setAmount] = React.useState<number>(10000);
    const recieverAddress = "7ZHcBghNEo8mLgam2qXhzBfpnvZDxJiJMZJs1upXAU4V";
    const endpoint = "https://fittest-falling-yard.solana-mainnet.quiknode.pro/ef9c6c4f493c90e3c52d95a11c5cf76f8a14def6";
    const wallets = [new walletAdapterWallets.PhantomWalletAdapter()];
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const {setF$rate} = React.useContext(GameContext) as GlobalContextProps;
    const SHAMY_TOKEN_MINT_ADDRESS = "BZJxQ5W4qbEtoo558R5oxsb3aXW7mfgCptDVJ2o4yvXg";

    React.useEffect(() => {
        const getBalances = async () => {
            if (connection && publicKey) {
                try {
                    const lamports = await connection.getBalance(publicKey);
                    setBalance(lamports / web3.LAMPORTS_PER_SOL);

                    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
                        mint: new web3.PublicKey(SHAMY_TOKEN_MINT_ADDRESS),
                    });
                    
                    if (tokenAccounts.value.length > 0) {
                        const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
                        setShamyBalance(balance);
                    } else {
                        setShamyBalance(0);
                    }
                } catch (error) {
                    console.error("Failed to fetch balances:", error);
                    setBalance(null);
                    setShamyBalance(null);
                }
            }
        };
        getBalances();
    }, [connection, publicKey]);

    const transferShamyToken = async () => {
        if (!publicKey) {
            alert("Connect to your wallet first.");
            return;
        }
        if (!recieverAddress || amount <= 0) {
            alert("Please enter a valid recipient address and amount.");
            return;
        }
        const applyBoost = () => {
            setF$rate(currentRate => currentRate * 5);
         };
         const removeBoost = () => {
           setF$rate(currentRate => currentRate / 5);
         }
    
        try {
            const sanitizedAddress = recieverAddress.trim();
    
            // Validate recipient address
            if (!web3.PublicKey.isOnCurve(sanitizedAddress)) {
                alert("Invalid recipient address. Please enter a valid Solana wallet address.");
                return;
            }
    
            const recipientPubkey = new web3.PublicKey(sanitizedAddress);
            const shamyMint = new web3.PublicKey(SHAMY_TOKEN_MINT_ADDRESS);
    
            // Get sender's associated token account
            const senderTokenAccount = await getAssociatedTokenAddress(
                shamyMint,
                publicKey
            );
    
            // Get recipient's associated token account
            const recipientTokenAccount = await getAssociatedTokenAddress(
                shamyMint,
                recipientPubkey
            );
    
            const transaction = new web3.Transaction();
    
            // Check if the recipient's token account exists
            const accountInfo = await connection.getAccountInfo(recipientTokenAccount);
            if (!accountInfo) {
                // Create associated token account for the recipient
                transaction.add(
                    createAssociatedTokenAccountInstruction(
                        publicKey, // Payer
                        recipientTokenAccount, // Associated token account address
                        recipientPubkey, // Owner of the token account
                        shamyMint // Token mint
                    )
                );
            }
    
            // Add the transfer instruction
            transaction.add(
                createTransferInstruction(
                    senderTokenAccount, // Source token account
                    recipientTokenAccount, // Destination token account
                    publicKey, // Owner of the source token account
                    amount * 10 ** 9 // Amount in smallest unit of token
                )
            );
    
            // Send the transaction
            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'confirmed');
            alert("Transfer successful!");
            applyBoost();

            // Set a timeout to remove the boost after one hour
            setTimeout(() => {
                removeBoost();
                alert("Boost has ended");
            }, 7200000); // 3600000 milliseconds = 1 hour
        } catch (error) {
            console.error("Failed to transfer SHAMY tokens:", error);
            alert("Transfer failed. Check the console for details.");
        }


      
    };
    
    return (
        <div className='flex items-center justify-center h-40 m-2 mt-10 text-white'>
            <div className='p-2 w-[300px]'>
                <div className='flex justify-start items-center w-full'>
                    <WalletMultiButton
                        className='!bg-indigo-600 !text-white !w-full !rounded-lg px-20 py-2 transition-transform transform hover:scale-105 focus:ring focus:ring-indigo-500'
                    />
                </div>

                <div className='my-2 bg-gray-700 border border-magentaPurple rounded-lg p-2 shadow-glow'>
                    <ul className='space-y-4'>
                        <li className='flex flex-col justify-center items-center px-2'>
                            <p className='tracking-wide text-2xl'>SHAMY Balance</p>
                            <p className='text-indigo-400 text-2xl'>
                                {shamyBalance !== null ? `${shamyBalance.toFixed(4)} SHAMY` : 'N/A'}
                            </p>
                        </li>
                    </ul>
                </div>

                <div className='mt-4 w-full'>
                    {/* {<input
                        type="number"
                        placeholder="Amount to Send"
                        className="w-30 p-1  rounded bg-gray-800 text-white border border-gray-600 mb-4"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                    />} */}
                    <button
                        onClick={transferShamyToken}
                        className="!bg-indigo-600 w-full !text-white text-2xl !rounded-lg px-4 py-3 transition-transform transform hover:scale-105 focus:ring focus:ring-indigo-500"
                    >
                        Boost with Shammy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SolanaConnection;
