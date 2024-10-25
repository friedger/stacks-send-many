import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';
import {
  addressFromPublicKeys,
  AddressHashMode,
  AddressVersion,
  createStacksPrivateKey,
  getPublicKey,
} from '@stacks/transactions';
import { accountsApi, mocknet, STACKS_API_ACCOUNTS_URL, testnet } from './constants';

export function getStacksAccount(appPrivateKey: string) {
  const privateKey = createStacksPrivateKey(appPrivateKey);
  const publicKey = getPublicKey(privateKey);
  const address = addressFromPublicKeys(
    testnet || mocknet ? AddressVersion.TestnetSingleSig : AddressVersion.MainnetSingleSig,
    AddressHashMode.SerializeP2PKH,
    1,
    [publicKey]
  );
  return { privateKey, address };
}

/**
 * Uses the AccountsApi of the stacks blockchain api client library,
 * returns the stacks balance object with property `balance` in decimal.
 */
export async function fetchAccount(addressAsString: string) {
  console.log(`Checking account "${addressAsString}"`);
  if (!addressAsString) {
    throw new Error('Address is undefined');
  }
  return accountsApi.getAccountBalance({
    principal: addressAsString,
  }) as Promise<AddressBalanceResponse>;
}

/**
 * Uses the RCP api of the stacks node directly,
 * returns the json object with property `balance` in hex.
 */
export async function fetchAccount2(addressAsString: string) {
  console.log('Checking account');
  const balanceUrl = `${STACKS_API_ACCOUNTS_URL}/${addressAsString}`;
  const r = await fetch(balanceUrl);
  console.log({ r });
  return await r.json();
}
