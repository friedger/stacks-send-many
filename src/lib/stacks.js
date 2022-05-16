import {
  TransactionsApi,
  SmartContractsApi,
  AccountsApi,
  Configuration,
  InfoApi,
} from '@stacks/blockchain-api-client';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { fetchJson } from './common';

const enableLogs = false;

const debugLog = msg => enableLogs && console.log(msg);

export const isTestnet = window.location.search.includes('chain=testnet');
export const isMocknet = !isTestnet && window.location.search.includes('mocknet=local');
export const isMainnet =
  (!isTestnet && !isMocknet) || window.location.search.includes('chain=mainnet');
debugLog(`isTestnet: ${isTestnet}`);
debugLog(`isMocknet: ${isMocknet}`);
debugLog(`isMainnet: ${isMainnet}`);

export const chainSuffix = `?chain=${isMainnet ? 'mainnet' : isTestnet ? 'testnet' : 'mocknet'}`;
debugLog(`chainSuffix: ${chainSuffix}`);

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

export const TESTNET_FAUCET_URL = 'https://explorer.stacks.co/sandbox/faucet?chain=testnet';

export const STACKS_NETWORK = isMainnet ? new StacksMainnet() : new StacksTestnet();
STACKS_NETWORK.coreApiUrl = STACKS_API;

export const STACKS_API_V2_INFO = `${STACKS_API}/v2/info`;
export const STACKS_API_ACCOUNTS_URL = `${STACKS_API}/v2/accounts`;
export const STACKS_API_ADDRESSINFO = `${STACKS_API}/extended/v1/address/`;
export const STACKS_API_MEMPOOL = `${STACKS_API}/extended/v1/tx/mempool`;
export const STACKS_API_FEE_URL = `${STACKS_API}/v2/fees/transfer`;

const config = new Configuration({ STACKS_API });
export const accountsApi = new AccountsApi(config);
export const smartContractsApi = new SmartContractsApi(config);
export const transactionsApi = new TransactionsApi(config);
export const infoApi = new InfoApi(config);

///////////////////////

const CC_API_BASE = `https://citycoins-api.citycoins.workers.dev`;

export const getStxBalance = async address => {
  const url = `${CC_API_BASE}/stacks/get-stx-balance/${address}`;
  const result = await fetchJson(url, undefined, enableLogs);
  return result.value;
};

// return the bns name, if found
export const getBnsName = async address => {
  const bnsName = await fetchJson(`${CC_API_BASE}/stacks/get-bns-name/${address}`).catch(() => {
    return undefined;
  });
  return bnsName;
};

// return the current Stacks block height
export const getCurrentBlockHeight = async () => {
  const response = await fetch(STACKS_API_V2_INFO);
  const json = await response.json();
  debugLog(`currentBlockHeight result: ${json.stacks_tip_height}`);
  return json.stacks_tip_height;
};

// return the estimated fee from API as integer
export async function getEstimatedStxFee() {
  const result = await fetch(STACKS_API_FEE_URL);
  const feeValue = await result.json();
  debugLog(`getEstimatedStxFee result: ${feeValue}`);
  return feeValue;
}

// return the average fee of the first 200 transactions in mempool
export const getMempoolFeeAvg = async () => {
  const response = await fetch(STACKS_API_MEMPOOL);
  const json = await response.json();
  const txs = json.results;
  const sum = txs.map(fee => parseInt(fee.fee_rate)).reduce((a, b) => a + b, 0);
  debugLog(`getMempoolFeeAvg result: ${sum / txs.length}`);
  return sum / txs.length;
};

// return the median fee of the first 200 transactions in mempool
export const getMempoolFeeMedian = async () => {
  const response = await fetch(STACKS_API_MEMPOOL);
  const json = await response.json();
  const txs = json.results;
  const fees = txs.map(fee => parseInt(fee.fee_rate));
  fees.sort((a, b) => a - b);
  const median = fees[Math.floor(fees.length / 2)];
  debugLog(`getMempoolFeeMedian result: ${median}`);
  return median;
};

// return the account transactions for a given principal
export const getTxs = async address => {
  const response = await fetch(`${STACKS_API_ADDRESSINFO}/${address}/transactions`);
  const json = await response.json();
  debugLog(`getTxs result: ${json.results}`);
  return json.results;
};

export function ustxToStx(ustx) {
  return parseInt(ustx) / 1000000;
}

export function stxToUstx(stx) {
  return parseInt(stx * 1000000);
}
