import * as React from 'react';
import * as web3 from '@solana/web3.js';
import * as walletAdapterReact from '@solana/wallet-adapter-react'; 
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
require('@solana/wallet-adapter-react-ui/styles.css');
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const SolanaConnection = () => {
    const [balance, setBalance] = React.useState<number | null>(0);
    
    // Use the custom RPC endpoint if you have one
    const endpoint = web3.clusterApiUrl('mainnet-beta');

    const wallets = [new walletAdapterWallets.PhantomWalletAdapter()];
    const { connection } = useConnection();
    const { publicKey } = useWallet();

    React.useEffect(() => {
        const getBalances = async () => {
            if (connection && publicKey) {
                try {
                    // Fetch SOL balance directly
                    const lamports = await connection.getBalance(publicKey);
                    setBalance(lamports / web3.LAMPORTS_PER_SOL);
                } catch (error) {
                    console.error("Failed to fetch SOL balance:", error);
                    setBalance(null); // Set balance to null if there's an error
                }
            }
        };
        getBalances();
    }, [connection, publicKey]);

    return (
        <>
            <walletAdapterReact.ConnectionProvider endpoint={endpoint}>
                <walletAdapterReact.WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
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
                                    </ul>
                                </div>
                            </div>
                        </main>
                    </WalletModalProvider>
                </walletAdapterReact.WalletProvider>
            </walletAdapterReact.ConnectionProvider>
        </>
    );
};

export default SolanaConnection;
