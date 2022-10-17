import { getUserData } from '@stacks/connect-react';
import { addressToString } from '@stacks/transactions';

import { useState, useEffect } from 'react';
import { getStacksAccount } from './account';
import { mocknet, testnet } from './constants';

export function useStxAddresses(userSession) {
  const [ownerStxAddress, setOwnerStxAddress] = useState();
  const [appStxAddress, setAppStxAddress] = useState();
  useEffect(() => {
    if (userSession) {
      getUserData(userSession).then(userData => {
        setOwnerStxAddress(userData.profile.stxAddress[testnet || mocknet ? 'testnet' : 'mainnet']);
      });
    }
  }, [userSession]);

  return { ownerStxAddress };
}
