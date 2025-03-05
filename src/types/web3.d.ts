import { Web3Provider } from '@ethersproject/providers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

declare module '@web3-react/core' {
  interface Web3ReactProviderProps {
    getLibrary: (provider: any) => Web3Provider;
    children: React.ReactNode;
  }
} 