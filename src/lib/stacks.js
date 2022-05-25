import {
  TransactionsApi,
  SmartContractsApi,
  AccountsApi,
  Configuration,
  InfoApi,
} from '@stacks/blockchain-api-client';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { fetchJson, debugLog } from './common';

export const isTestnet = window.location.search.includes('chain=testnet');
export const isMocknet = !isTestnet && window.location.search.includes('mocknet=local');
export const isMainnet =
  (!isTestnet && !isMocknet) || window.location.search.includes('chain=mainnet');
debugLog(`isTestnet: ${isTestnet}`);
debugLog(`isMocknet: ${isMocknet}`);
debugLog(`isMainnet: ${isMainnet}`);

export const CHAIN_SUFFIX = `?chain=${isMainnet ? 'mainnet' : isTestnet ? 'testnet' : 'mocknet'}`;
debugLog(`chainSuffix: ${CHAIN_SUFFIX}`);

export const STACKS_API = isMainnet
  ? 'https://stacks-node-api.mainnet.stacks.co'
  : isTestnet
  ? 'https://stacks-node-api.testnet.stacks.co'
  : 'http://localhost:3999';
export const STACKS_API_WS = isMainnet
  ? 'wss://stacks-node-api.mainnet.stacks.co/'
  : isTestnet
  ? 'wss://stacks-node-api.testnet.stacks.co/'
  : 'ws://localhost:3999';
debugLog(`STACKS_API: ${STACKS_API}`);
debugLog(`STACKS_API_WS: ${STACKS_API_WS}`);

export const STACKS_EXPLORER = 'https://explorer.stacks.co';

export const TESTNET_FAUCET_URL = 'https://explorer.stacks.co/sandbox/faucet?chain=testnet';

export const STACKS_NETWORK = isMainnet ? new StacksMainnet() : new StacksTestnet();
STACKS_NETWORK.coreApiUrl = STACKS_API;

const config = new Configuration({ STACKS_API });
export const accountsApi = new AccountsApi(config);
export const smartContractsApi = new SmartContractsApi(config);
export const transactionsApi = new TransactionsApi(config);
export const infoApi = new InfoApi(config);

///////////////////////

const CC_API_BASE = `https://citycoins-api.citycoins.workers.dev`;

export const getStxBalance = async address => {
  const url = `${CC_API_BASE}/stacks/get-stx-balance/${address}`;
  const result = await fetchJson(url);
  return result.value;
};

export const getBlockHeight = async () => {
  const url = `${CC_API_BASE}/stacks/get-block-height`;
  const result = await fetchJson(url);
  return result.value;
};

// return the bns name, if found
export const getBnsName = async address => {
  const result = await fetchJson(`${CC_API_BASE}/stacks/get-bns-name/${address}`).catch(() => {
    return undefined;
  });
  return result.value;
};

export function toMicro(value) {
  return parseInt(value * 1000000);
}

export function fromMicro(value) {
  return parseInt(value / 1000000);
}
