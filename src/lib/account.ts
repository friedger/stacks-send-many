import { accountsApi, STACKS_API_ACCOUNTS_URL } from './constants';
import { AccountBalanceResponse } from './types';

/**
 * Uses the AccountsApi of the stacks blockchain api client library,
 * returns the stacks balance object with property `balance` in decimal.
 */
export async function fetchAccount(addressAsString: string): Promise<AccountBalanceResponse> {
  console.log(`Checking account "${addressAsString}"`);
  if (!addressAsString) {
    throw new Error('Address is undefined');
  }
  return accountsApi
    .GET('/extended/v1/address/{principal}/balances', {
      params: {
        path: {
          principal: addressAsString,
        },
      },
    })
    .then(response => {
      if (response.error) {
        throw new Error(`Failed to fetch account: ${response.error}`);
      }
      return response.data!;
    });
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
