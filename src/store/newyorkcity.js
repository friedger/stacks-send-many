import { isTestnet } from '../lib/stacks';

/*
export const NYC_CONTRACTS = {
  deployer: testnet
    ? 'ST3ESBKBNA2PTSQZFMC729RAX1YBSBXDGJK8SMF1Y'
    : 'SP2H8PY27SEZ03MWRKS5XABZYQN17ETGQS3527SA5',
  coreContract: 'newyorkcitycoin-core-v1',
  authContract: 'newyorkcitycoin-auth',
  tokenContract: 'newyorkcitycoin-token',
};
*/

export const NYC_CONTRACTS = {
  deployer: isTestnet ? '' : 'SPSCWDV3RKV5ZRN1FQD84YE1NQFEDJ9R1F4DYQ11',
  coreContract: 'newyorkcitycoin-core-v2',
  authContract: 'newyorkcitycoin-auth-v2',
  tokenContract: 'newyorkcitycoin-token-v2',
};

export const NYC_TOKEN = {
  text: 'NYCCoin',
  name: 'newyorkcitycoin',
  symbol: 'NYC',
};

// TODO: update halving value here
export const NYC_CONFIG = {
  cityName: 'New York City',
  cityWallet: isTestnet
    ? 'ST24A7X58T6QS7P56J8KGBRTQ0SEWVR4VRFQMD9JT'
    : 'SM18VBF2QYAAHN57Q28E2HSM15F6078JZYZ2FQBCX',
  halving: 210000,
  rewardCycleLength: 2100,
  startBlock: isTestnet ? 19302 : 37449,
};
