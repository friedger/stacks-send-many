import { getUserData } from '@stacks/connect-react';
import { addressToString } from '@stacks/transactions';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useEffect } from 'react';
import { getStacksAccount } from './account';
import { userAppStxAddress, userStxAddress } from './auth';
import { mocknet, testnet } from './constants';

export function useStxAddresses(userSession) {
  return null;
}

export function updateStacksProfile(userSession) {
  return null;
}
