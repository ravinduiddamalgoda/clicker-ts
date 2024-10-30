import React from 'react';
import * as web3 from '@solana/web3.js';
import * as walletAdapterReact from '@solana/wallet-adapter-react';
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import SolanaConnection from './component/SolanaConnection';
require('@solana/wallet-adapter-react-ui/styles.css');

const App = () => {
    const endpoint = "https://fittest-falling-yard.solana-mainnet.quiknode.pro/ef9c6c4f493c90e3c52d95a11c5cf76f8a14def6";
    const wallets = [new walletAdapterWallets.PhantomWalletAdapter()];
    
    return (
        <walletAdapterReact.ConnectionProvider endpoint={endpoint}>
            <walletAdapterReact.WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <SolanaConnection />
                </WalletModalProvider>
            </walletAdapterReact.WalletProvider>
        </walletAdapterReact.ConnectionProvider>
    );
};

export default App;
