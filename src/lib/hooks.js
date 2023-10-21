import { getUserData } from '@stacks/connect-react';
import { useAtom, useAtomValue } from 'jotai';

import { useEffect, useState } from 'react';
import { useConnect, userSessionState, wcClientState, wcSessionState } from './auth';
import { mocknet, testnet } from './constants';

export function useStxAddresses() {
  const [ownerStxAddress, setOwnerStxAddress] = useState();
  const userSession = useAtomValue(userSessionState);
  const wcSession = useAtomValue(wcSessionState);
  const { authenticated } = useConnect();

  useEffect(() => {
    if (userSession && userSession.isUserSignedIn()) {
      getUserData(userSession).then(userData => {
        setOwnerStxAddress(userData.profile.stxAddress[testnet || mocknet ? 'testnet' : 'mainnet']);
      });
    } else if (wcSession) {
      const firstAccount = wcSession?.namespaces?.stacks?.accounts[0];
      const [, , address] = firstAccount.split(':');
      setOwnerStxAddress(address);
    } else if (!userSession || !userSession.isUserSignedIn || !wcSession) {
      setOwnerStxAddress(undefined);
    }
  }, [userSession, wcSession, authenticated]);

  return { ownerStxAddress };
}

export function useWalletConnect() {
  const wcClient = useAtomValue(wcClientState);
  const [wcSession, setWcSession] = useAtom(wcSessionState);
  return { wcClient, wcSession, setWcSession };
}
