import { useAtom, useAtomValue } from 'jotai';

import { getLocalStorage, isConnected } from '@stacks/connect';
import { useEffect } from 'react';
import { ownerStxAddressState, wcClientState, wcSessionState } from './auth';

export function useStxAddresses() {
  const [ownerStxAddress, setOwnerStxAddress] = useAtom(ownerStxAddressState);
  const wcSession = useAtomValue(wcSessionState);

  // Initialize connection state on mount
  useEffect(() => {
    // Check if user is already connected from local storage
    const addresses = getLocalStorage()?.addresses.stx;
    if (addresses && addresses.length > 0) {
      setOwnerStxAddress(addresses[0].address);
    }
  }, [setOwnerStxAddress]);

  // Update address when connection status or wcSession changes
  useEffect(() => {
    if (isConnected()) {
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
  }, [isConnected(), wcSession]);

  return { ownerStxAddress };
}

export function useWalletConnect() {
  const wcClient = useAtomValue(wcClientState);
  const [wcSession, setWcSession] = useAtom(wcSessionState);
  return { wcClient, wcSession, setWcSession };
}
