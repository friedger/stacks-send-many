import { getUserData } from '@stacks/connect-react';

import { useState, useEffect } from 'react';
import { mocknet, testnet } from './constants';

export function useStxAddresses(userSession, wcSession) {
  const [ownerStxAddress, setOwnerStxAddress] = useState();
  useEffect(() => {
    if (userSession && userSession.isUserSignedIn()) {
      getUserData(userSession).then(userData => {
        setOwnerStxAddress(userData.profile.stxAddress[testnet || mocknet ? 'testnet' : 'mainnet']);
      });
    } else if (wcSession) {
      const firstAccount = wcSession?.namespaces?.stacks?.accounts[0];
      const [, , address] = firstAccount.split(':');
      setOwnerStxAddress(address);
    }
  }, [userSession, wcSession]);

  return { ownerStxAddress };
}
