import {
  createStacksPrivateKey,
  getPublicKey,
  addressFromPublicKeys,
  AddressVersion,
  AddressHashMode,
  callReadOnlyFunction,
  bufferCVFromString,
  ClarityType,
  cvToString,
  TupleCV,
  PrincipalCV,
} from '@stacks/transactions';
import {
  accountsApi,
  BNS_CONTRACT_NAME,
  GENESIS_CONTRACT_ADDRESS,
  mocknet,
  NETWORK,
  STACKS_API_ACCOUNTS_URL,
  testnet,
} from './constants';
import { UserSession } from '@stacks/connect';
import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';

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

export async function getUserAddress(userSession: UserSession, username: string) {
  const parts = username.split('.');
  if (parts.length === 2) {
    console.log(parts);
    const result = await callReadOnlyFunction({
      contractAddress: GENESIS_CONTRACT_ADDRESS,
      contractName: BNS_CONTRACT_NAME,
      functionName: 'name-resolve',
      functionArgs: [bufferCVFromString(parts[1]), bufferCVFromString(parts[0])],
      network: NETWORK,
      senderAddress: GENESIS_CONTRACT_ADDRESS,
    });
    if (result.type === ClarityType.ResponseOk) {
      const value = result.value as TupleCV<{
        owner: PrincipalCV;
        // FIXME: These parts are also returned but nobody cares really
        // zonefile-hash: (get zonefile-hash name-props),
        // owner: owner,
        // lease-started-at: lease-started-at,
        // lease-ending-at: (if (is-eq (get lifetime namespace-props) u0) none (some (+ lease-started-at (get lifetime namespace-props))))
      }>;
      return { address: cvToString(value.data.owner) };
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
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
