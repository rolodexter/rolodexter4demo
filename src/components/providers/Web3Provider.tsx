'use client';

import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider as EthersWeb3Provider } from '@ethersproject/providers';
import React from 'react';

// Function to get library
function getLibrary(provider: any) {
  return new EthersWeb3Provider(provider);
}

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      {children}
    </Web3ReactProvider>
  );
} 