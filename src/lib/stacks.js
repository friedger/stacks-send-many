import { stacksMainnet } from '@stacks/network';

export const CITYCOIN_DEPLOYER = 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27';
export const CITYCOIN_VRF = 'citycoin-vrf';

export const STACKS_API_URL = 'https://stacks-node-api.mainnet.stacks.co';
export const STACKS_API_V2_INFO = `${STACKS_API_URL}/v2/info`;
export const STACKS_API_ACCOUNTS_URL = `${STACKS_API_URL}/v2/accounts`;
export const STACKS_API_MEMPOOL = `${STACKS_API_URL}/extended/v1/tx/mempool`;

export const NETWORK = new stacksMainnet();
NETWORK.coreApiUrl = STACKS_API_URL;

// return the current Stacks block height
export const currentBlockHeight = async () => {
  const response = await fetch(STACKS_API_V2_INFO).then();
  const json = await response.json();
  console.log(`currentBlockHeight result: ${json.block_height}`);
  return json.block_height;
};

// return the average fee of the first 200 transactions in mempool
export const getMempoolFeeAvg = async () => {
  const response = await fetch(STACKS_API_MEMPOOL);
  const json = await response.json();
  const txs = json.txs;
  const fees = txs.map(tx => tx.fee);
  const sum = fees.reduce((a, b) => a + b, 0);
  console.log(`getMempoolFeeAvg result: ${sum / fees.length}`);
  return sum / fees.length;
};

// return the median fee of the first 200 transactions in mempool
export const getMempoolFeeMedian = async () => {
  const response = await fetch(STACKS_API_MEMPOOL);
  const json = await response.json();
  const txs = json.txs;
  const fees = txs.map(tx => tx.fee);
  fees.sort((a, b) => a - b);
  const median = fees[Math.floor(fees.length / 2)];
  console.log(`getMempoolFeeMedian result: ${median}`);
  return median;
};
