import {testnet} from "../lib/constants"

export const NYC_CONTRACTS = {
  deployer: testnet ? 'ST3ESBKBNA2PTSQZFMC729RAX1YBSBXDGJK8SMF1Y' : '',
  coreContract: 'newyorkcitycoin-core-v1',
  authContract: 'newyorkcitycoin-auth',
  tokenContract: 'newyorkcitycoin-token',
};

export const NYC_TOKEN = {
  name: 'newyorkcitycoin',
  symbol: 'NYC',
};

export const NYC_CONFIG = {
  cityName: 'New York City',
  cityWallet: testnet ? 'ST24A7X58T6QS7P56J8KGBRTQ0SEWVR4VRFQMD9JT' : '',
  rewardCycleLength: 0,
  startBlock: 0,
};
