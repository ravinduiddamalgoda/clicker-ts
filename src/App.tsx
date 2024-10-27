import React from 'react';
import * as web3 from '@solana/web3.js';
import * as walletAdapterReact from '@solana/wallet-adapter-react';
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import SolanaConnection from './component/SolanaConnection';
require('@solana/wallet-adapter-react-ui/styles.css');

const App = () => {
    const endpoint = web3.clusterApiUrl('mainnet-beta');
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
