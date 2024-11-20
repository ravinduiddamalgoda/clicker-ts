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

const SolanaConnection = () => {
    const [balance, setBalance] = React.useState<number | null>(0);
    const [shamyBalance, setShamyBalance] = React.useState<number | null>(0);
    const [recipientAddress, setRecipientAddress] = React.useState<string>('');
    const [amount, setAmount] = React.useState<number>(0);

    const endpoint = "https://fittest-falling-yard.solana-mainnet.quiknode.pro/ef9c6c4f493c90e3c52d95a11c5cf76f8a14def6";
    const wallets = [new walletAdapterWallets.PhantomWalletAdapter()];
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

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
        if (!recipientAddress || amount <= 0) {
            alert("Please enter a valid recipient address and amount.");
            return;
        }
    
        try {
            const sanitizedAddress = recipientAddress.trim();
    
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
        } catch (error) {
            console.error("Failed to transfer SHAMY tokens:", error);
            alert("Transfer failed. Check the console for details.");
        }
    };
    
    return (
        <main className='min-h-screen flex items-center justify-center bg-gray-900 text-white'>
            <div className='max-w-lg w-full bg-gray-800 p-6 rounded-xl shadow-lg'>
                <div className='flex justify-between items-center'>
                    <h1 className='text-2xl font-semibold'>Solana Wallet</h1>
                    <WalletMultiButton
                        className='!bg-indigo-600 !text-white !rounded-lg px-4 py-2 transition-transform transform hover:scale-105 focus:ring focus:ring-indigo-500'
                    />
                </div>

                <div className='mt-8 bg-gray-700 border border-gray-600 rounded-lg p-4'>
                    <ul className='space-y-4'>
                        <li className='flex justify-between items-center'>
                            <p className='tracking-wide text-lg'>Wallet is connected:</p>
                            <p className='text-indigo-400 font-semibold'>
                                {publicKey ? 'Yes' : 'No'}
                            </p>
                        </li>

                        <li className='flex justify-between items-center'>
                            <p className='tracking-wide text-lg'>SOL Balance:</p>
                            <p className='text-indigo-400 font-semibold'>
                                {balance !== null ? `${balance.toFixed(4)} SOL` : 'N/A'}
                            </p>
                        </li>

                        <li className='flex justify-between items-center'>
                            <p className='tracking-wide text-lg'>SHAMY Balance:</p>
                            <p className='text-indigo-400 font-semibold'>
                                {shamyBalance !== null ? `${shamyBalance.toFixed(4)} SHAMY` : 'N/A'}
                            </p>
                        </li>
                    </ul>
                </div>

                <div className='mt-4'>
                    <input
                        type="text"
                        placeholder="Recipient Address"
                        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Amount to Send"
                        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-4"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                    />
                    <button
                        onClick={transferShamyToken}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Send SHAMY
                    </button>
                </div>
            </div>
        </main>
    );
};

export default SolanaConnection;
