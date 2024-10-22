import '@solana/wallet-adapter-react-ui/styles.css';
import React, { useMemo } from "react";
import SolanaConnection from "./component/SolanaConnection";

const App: React.FC = () => {

  return (
    <div>
      <h1>Multi-Blockchain Wallet Connection</h1>
            <div className="solana-connection">
              <h2>Solana Wallet</h2>
              <SolanaConnection />
            </div>
    </div>
  );
};

export default App;
