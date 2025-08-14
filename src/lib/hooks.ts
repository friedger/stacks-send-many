import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { connect, disconnect, getLocalStorage } from '@stacks/connect';
import { useEffect } from 'react';
import { stacksConnectedState, wcClientState, wcSessionState, ownerStxAddressState } from './auth';

// Helper functions to manage connection state
export function useStacksConnection() {
  const setStacksConnected = useSetAtom(stacksConnectedState);

  const connectWallet = async () => {
    try {
      const response = await connect();
      setStacksConnected(true);
      return response;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setStacksConnected(false);
      throw error;
    }
  };

  const disconnectWallet = () => {
    disconnect();
    setStacksConnected(false);
  };

  return { connectWallet, disconnectWallet };
}

export function useStxAddresses() {
  const [ownerStxAddress, setOwnerStxAddress] = useAtom(ownerStxAddressState);
  const stacksConnected = useAtomValue(stacksConnectedState);
  const setStacksConnected = useSetAtom(stacksConnectedState);
  const wcSession = useAtomValue(wcSessionState);

  // Initialize connection state on mount
  useEffect(() => {
    // Check if user is already connected from local storage
    const addresses = getLocalStorage()?.addresses.stx;
    if (addresses && addresses.length > 0) {
      setStacksConnected(true);
      setOwnerStxAddress(addresses[0].address);
    }
  }, [setStacksConnected]);

  // Update address when connection status or wcSession changes
  useEffect(() => {
    console.log('useStxAddresses effect:', { stacksConnected, wcSession });

    if (stacksConnected) {
      // Get address from localStorage - it should be available since connect() promise resolved
      const addresses = getLocalStorage()?.addresses.stx;
      console.log('Addresses from local storage:', addresses);

      if (addresses && addresses.length > 0) {
        setOwnerStxAddress(addresses[0].address);
      }
    } else if (wcSession) {
      const firstAccount = wcSession?.namespaces?.stacks?.accounts[0];
      if (firstAccount) {
        const [, , address] = firstAccount.split(':');
        setOwnerStxAddress(address);
      }
    } else {
      setOwnerStxAddress(undefined);
    }
  }, [stacksConnected, wcSession]);

  return { ownerStxAddress };
}

export function useWalletConnect() {
  const wcClient = useAtomValue(wcClientState);
  const [wcSession, setWcSession] = useAtom(wcSessionState);
  return { wcClient, wcSession, setWcSession };
}
