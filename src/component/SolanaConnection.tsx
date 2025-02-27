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
import { myConstants } from '../config/config';

interface GlobalContextProps {
    fCount: number;
    level: number;
   // levelupRate: number;
    myConstants: {
      miner_base_cost: number;
      F$_Multiplier : number;
    };
    message: string;
    showMessage: boolean;
    setfCount: React.Dispatch<React.SetStateAction<number>>;
    setLevel: React.Dispatch<React.SetStateAction<number>>;
    currentView: string;
    setCurrentView: React.Dispatch<React.SetStateAction<string>>;
    setF$rate: React.Dispatch<React.SetStateAction<number>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    setShowMessage:React.Dispatch<React.SetStateAction<boolean>>;
    
  }
  
const SolanaConnection = () => {
    const [balance, setBalance] = React.useState<number | null>(0);
    const [usdtBalance, setusdtBalance] = React.useState<number | null>(0);
    const [shamyBalance, setShamyBalance] = React.useState<number | null>(0);
    const [amount, setAmount] = React.useState<number>(myConstants.ShamyBoost);
    const recieverAddress = "7ZHcBghNEo8mLgam2qXhzBfpnvZDxJiJMZJs1upXAU4V";


  //  const endpoint = "https://fittest-falling-yard.solana-mainnet.quiknode.pro/ef9c6c4f493c90e3c52d95a11c5cf76f8a14def6";
  //  const wallets = [new walletAdapterWallets.PhantomWalletAdapter()];
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const {currentView, setF$rate, message, showMessage, setShowMessage, setMessage} = React.useContext(GameContext) as GlobalContextProps;
    const SHAMY_TOKEN_MINT_ADDRESS = "BZJxQ5W4qbEtoo558R5oxsb3aXW7mfgCptDVJ2o4yvXg";
    const USDT_TOKEN_MINT_ADDRESS = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
    
   

    React.useEffect(() => {
        const getBalances = async () => {
            if (connection && publicKey) {
                try {
                    const lamports = await connection.getBalance(publicKey);
                    setBalance(lamports / web3.LAMPORTS_PER_SOL);

                    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
                        mint: new web3.PublicKey(SHAMY_TOKEN_MINT_ADDRESS),
                    });

                    const usdtAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
                        mint: new web3.PublicKey(USDT_TOKEN_MINT_ADDRESS),
                    });
                    
                    if (tokenAccounts.value.length > 0) {
                        const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
                        setShamyBalance(balance);                        
                    } else {
                        setShamyBalance(0);
                    }

                    if(usdtAccounts.value.length>0){
                        const usdtBalance = usdtAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
                        setusdtBalance(usdtBalance);
                    }else{
                        setusdtBalance(0);
                    }
                } catch (error) {
                    console.error("Failed to fetch balances:", error);
                    setBalance(null);
                    setShamyBalance(null);
                }
            }else{setShamyBalance(0);}
        };
        getBalances();
    }, [connection, publicKey]);

    const transferShamyToken = async () => {
        if (!publicKey) {            
            setMessage(pre=> pre = "Connect to your wallet first.");
            setShowMessage(true);
            return;
        }
        if (!recieverAddress || amount <= 0) {            
            setMessage(pre=> pre = "Please enter a valid recipient address and amount.");
            setShowMessage(true);
            return;
        }
        if (shamyBalance === null || shamyBalance < myConstants.ShamyBoost) {            
            setMessage(pre=> pre = "Not enough Shamy tokens.");
            setShowMessage(true);
            return;
        }
        const applyBoost = () => {
            setF$rate(currentRate => currentRate * myConstants.$Shamy_Multiplier);
         };
         const removeBoost = () => {
           setF$rate(currentRate => currentRate /  myConstants.$Shamy_Multiplier);
         }
    
        try {
            const sanitizedAddress = recieverAddress.trim();
    
            // Validate recipient address
            if (!web3.PublicKey.isOnCurve(sanitizedAddress)) {               
                setMessage(pre=> pre = "Invalid recipient address. Please enter a valid Solana wallet address.");
                setShowMessage(true);
                
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
            setMessage(pre=> pre = "Transfer successful!");
            setShowMessage(true);
            applyBoost();

            // Set a timeout to remove the boost after one hour
            setTimeout(() => {
                removeBoost();                
                setMessage(pre=> pre = "Boost has ended.");
                setShowMessage(true);
            }, 7200000); // 3600000 milliseconds = 1 hour
        } catch (error) {
            console.error("Failed to transfer SHAMY tokens:", error);
            alert("Transfer failed. Check the console for details.");
        }


      
    };

    const handleBuyShamy =()=> {
        window.open("https://dexscreener.com/solana/BZJxQ5W4qbEtoo558R5oxsb3aXW7mfgCptDVJ2o4yvXg?1718881989302", "_blank");
    };
    
    return (
        <div className='flex w-full'>
            <div className='px-2 w-full'>
                
                <div className="flex  justify-between">                    
                    <div className='flex'>
                        <WalletMultiButton
                            className='!bg-indigo-600 !text-white !w-full !rounded-lg px-20 py-2 transition-transform transform hover:scale-105 focus:ring focus:ring-indigo-500'
                        />                        
                    </div>
                    
                    <div className='flex p-2 '>
                        <ul className='space-y-4'>
                            <li className='flex flex-col justify-center items-center '>
                                {currentView ==="BoostPage" &&(
                                    <p className='text-indigo-400 text-sm tracked-wider'>
                                
                                    {shamyBalance !== null ? `${shamyBalance.toLocaleString('en-US')} SHAMY` : 'N/A'}
                                    
                                    </p> )} 
                                {currentView ==="SubPage" &&(
                                    <p className='text-aqua text-sm tracked-wider justify-right'>
                                    {usdtBalance !== null ? `${usdtBalance.toLocaleString('en-US')} USDT` : 'N/A'}
                                    <br /><span className='text-white'>Entries: 0</span>
                                    </p>
                                )}  
                                 
                                
                            </li>
                        </ul>
                    </div>      
                </div>
                {currentView ==="BoostPage" && ( <>
                <div className='flex flex-col text-xl justify-center text-blue-400 items-center mt-4'> <p>Boost with SHAMY Token </p>
                    <p className="text-xl ">Boost F$ generation x15 for 2 Hours</p>
                </div>
               
                <div className="flex  gap-1 justify-between mt-4 mb-4">
                    
                    <div className='flex w-1/2'>
                        
                        <button
                            onClick={transferShamyToken}
                            className="!bg-indigo-600 !text-white text-xl !rounded-lg px-4 py-1 transition-transform transform hover:scale-105 focus:ring focus:ring-indigo-500"
                        >
                            {myConstants.ShamyBoost} SHAMY  Boost
                        </button>
                    </div>
                    <div className='flex w-1/2'>
                     
                     <button
                         onClick={handleBuyShamy}
                         className="!bg-aqua w-full !text-indigo-600 text-xl items-center !rounded-lg px-4 transition-transform transform hover:scale-105"
                     >
                         BUY $SHAMY  
                     </button>
                 </div> 

                </div></> )}
                           
            </div>

           
        </div>
    );
};

export default SolanaConnection;
