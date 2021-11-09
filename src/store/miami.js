import { testnet } from '../lib/stacks';

export const MIA_CONTRACTS = {
  deployer: testnet ? '' : 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27',
  coreContract: 'miamicoin-core-v1',
  authContract: 'miamicoin-auth',
  tokenContract: 'miamicoin-token',
};

export const MIA_TOKEN = {
  text: 'MiamiCoin',
  name: 'miamicoin',
  symbol: 'MIA',
};

export const MIA_CONFIG = {
  cityName: 'Miami',
  cityWallet: testnet ? '' : 'SM2MARAVW6BEJCD13YV2RHGYHQWT7TDDNMNRB1MVT',
  halving: 210000,
  rewardCycleLength: 2100,
  startBlock: 24497,
};
