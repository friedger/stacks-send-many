import { getUserData } from '@stacks/connect-react';

import { useState, useEffect } from 'react';
import { mocknet, testnet } from './constants';

export function useStxAddresses(userSession) {
  const [ownerStxAddress, setOwnerStxAddress] = useState();
  useEffect(() => {
    if (userSession) {
      getUserData(userSession).then(userData => {
        setOwnerStxAddress(userData.profile.stxAddress[testnet || mocknet ? 'testnet' : 'mainnet']);
      });
    }
  }, [userSession]);

  return { ownerStxAddress };
}
