import '@solana/wallet-adapter-react-ui/styles.css';
import React, { useMemo } from "react";
import SolanaConnection from "./component/SolanaConnection";
import { WalletConnectButton } from '@solana/wallet-adapter-react-ui';

const App: React.FC = () => {

  return (
    <div>
        <div className="solana-connection">
          <WalletConnectButton className='!bg-helius-orange hover:!bg-black transition-all duration-200 !rounded-lg' />
        </div>
    </div>
  );
};

export default App;
