import { testnet } from '../lib/stacks';

/*
export const MIA_CONTRACTS = {
  deployer: testnet ? '' : 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27',
  coreContract: 'miamicoin-core-v1',
  authContract: 'miamicoin-auth',
  tokenContract: 'miamicoin-token',
};
*/

export const MIA_CONTRACTS = {
  deployer: testnet ? '' : 'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R',
  coreContract: 'miamicoin-core-v2',
  authContract: 'miamicoin-auth-v2',
  tokenContract: 'miamicoin-token-v2',
};

export const MIA_TOKEN = {
  text: 'MiamiCoin',
  name: 'miamicoin',
  symbol: 'MIA',
};

// TODO: update halving value here
export const MIA_CONFIG = {
  cityName: 'Miami',
  cityWallet: testnet ? '' : 'SM2MARAVW6BEJCD13YV2RHGYHQWT7TDDNMNRB1MVT',
  halving: 210000,
  rewardCycleLength: 2100,
  startBlock: 24497,
};
