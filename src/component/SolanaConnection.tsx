import * as React from 'react';
import * as web3 from '@solana/web3.js';
import * as walletAdapterReact from '@solana/wallet-adapter-react'; 
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
require('@solana/wallet-adapter-react-ui/styles.css');
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const SolanaConnection = () => {
    const [balance, setBalance] = React.useState<number | null>(0);
    const endpoint = web3.clusterApiUrl('devnet');
    const wallets = [
        new walletAdapterWallets.PhantomWalletAdapter()
    ];

    const { connection } = useConnection();
    const { publicKey } = useWallet();

    React.useEffect(() => {
        const getInfo = async () => {
            if (connection && publicKey) {
                const info = await connection.getAccountInfo(publicKey);
                setBalance(info!.lamports / web3.LAMPORTS_PER_SOL);
            }
        }
        getInfo();
    }, [connection, publicKey]);

    return (
        <>
            <walletAdapterReact.ConnectionProvider endpoint={endpoint}>
                <walletAdapterReact.WalletProvider wallets={wallets}>
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
                                            <p className='tracking-wide text-lg'>Balance:</p>
                                            <p className='text-indigo-400 font-semibold'>
                                                {balance !== null ? `${balance.toFixed(2)} SOL` : 'N/A'}
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
