import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { getUserData } from '@stacks/connect';
import { addressToString } from '@stacks/transactions';
import { getStacksAccount } from '../../lib/account';
import {
  useConnect,
  userAppStxAddress,
  userLoggedIn,
  userSessionState,
  userStxAddress,
} from '../../lib/auth';
import { isMocknet, isTestnet } from '../../lib/stacks';
import { ProfileSmall } from '../profile/ProfileSmall';

export default function HeaderAuth() {
  const { handleOpenAuth } = useConnect();
  const [userSession] = useAtom(userSessionState);
  const [signedIn] = useAtom(userLoggedIn);
  const setOwnerStxAddress = useUpdateAtom(userStxAddress);
  const setAppStxAddress = useUpdateAtom(userAppStxAddress);

  useEffect(() => {
    if (signedIn) {
      getUserData(userSession).then(data => {
        const { address } = getStacksAccount(data.appPrivateKey);
        setAppStxAddress(addressToString(address));
        const stxAddress = data.profile.stxAddress[isTestnet || isMocknet ? 'testnet' : 'mainnet'];
        setOwnerStxAddress(stxAddress);
      });
    }
  }, [signedIn, setAppStxAddress, setOwnerStxAddress, userSession]);

  if (signedIn) return <ProfileSmall />;

  return (
    <button className="btn btn-lg btn-outline-primary" type="button" onClick={handleOpenAuth}>
      Connect Wallet
    </button>
  );
}
