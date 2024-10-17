interface Window {
  // For Telegram WebApp
  Telegram: {
    WebApp: {
      initDataUnsafe: any;
      ready: () => void;
      close: () => void;
      sendData: (data: string) => void;
      showAlert: (message: string) => void;
    };
  };

  // For MetaMask / Ethereum
  ethereum?: {
    isMetaMask?: true;
    request: (...args: any[]) => Promise<any>;
    on?: (event: string, callback: (...args: any[]) => void) => void;
  };
}
