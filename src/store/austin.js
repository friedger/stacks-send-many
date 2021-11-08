import {testnet} from "../lib/constants"

export const ATX_CONTRACTS = {
  deployer: testnet ? 'ST2NJ50P1WY54JRD21GDKFB1SQ6JFPR8EVFRHA42R' : '',
  coreContract: 'austincoin-core-v1',
  authContract: 'austincoin-auth',
  tokenContract: 'austincoin-token',
};

export const ATX_TOKEN = {
  name: 'austincoin',
  symbol: 'ATX',
};

export const ATX_CONFIG = {
  cityName: 'Austin',
  cityWallet: '',
  rewardCycleLength: 0,
  startBlock: 0,
};
