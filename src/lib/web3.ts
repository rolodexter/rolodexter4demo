import { InjectedConnector } from '@web3-react/injected-connector';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import React from 'react';

// Define supported chain IDs
const supportedChainIds = [1, 3, 4, 5, 42, 56, 97];

// Create the injected connector
export const injected = new InjectedConnector({
  supportedChainIds,
});

// Function to get library
export function getLibrary(provider: any) {
  return new Web3Provider(provider);
}

// Web3 React Provider wrapper component
export const Web3ProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      {children}
    </Web3ReactProvider>
  );
};

// Custom hook to safely access window.ethereum
export function useEthereum() {
  if (typeof window !== 'undefined' && window.ethereum) {
    return window.ethereum;
  }
  return null;
} 