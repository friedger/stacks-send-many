import { fetchJson } from './common';

// enable console logging
const enableLogs = false;

// using develop branch until next release
const CC_API_BASE = `https://citycoins-api.citycoins.workers.dev`;
// const CC_API_BASE = `https://api.citycoins.co`;

// get a city's configuration file
export const getCityConfig = async (version, city) => {
  const url = `${CC_API_BASE}/tools/${version}/${city}/get-city-configuration`;
  return await fetchJson(url, enableLogs);
};

export const getActivationBlock = async (version, city) => {
  const url = `${CC_API_BASE}/${version}/${city}/get-activation-block`;
  return await fetchJson(url, enableLogs);
};

export const getCCBalance = async (version, city, address) => {
  const url = `${CC_API_BASE}/${version}/${city}/token/get-balance/${address}`;
  const result = await fetchJson(url, enableLogs);
  return result.value;
};

export const getRewardCycle = async (version, city, block = undefined) => {
  const url = `${CC_API_BASE}/${version}/${city}/stacking/get-reward-cycle/${
    block ? block : 'current'
  }`;
  try {
    const result = await fetchJson(url, enableLogs);
    return result.value;
  } catch (err) {
    console.log(`getRewardCycle: ${err}`);
    return undefined;
  }
};

export const getUserId = async (version, city, address) => {
  const url = `${CC_API_BASE}/${version}/${city}/activation/get-user-id/${address}`;
  try {
    const result = await fetchJson(url, enableLogs);
    return result.value;
  } catch (err) {
    console.log(`getUserId: ${err}`);
    return undefined;
  }
};

export const getFirstStacksBlockInRewardCycle = async (version, city, cycle) => {
  const url = `${CC_API_BASE}/${version}/${city}/stacking/get-first-stacks-block-in-reward-cycle/${cycle}`;
  try {
    const result = await fetchJson(url, enableLogs);
    return result.value;
  } catch (err) {
    console.log(`getFirstStacksBlockInRewardCycle: ${err}`);
    return undefined;
  }
};

export const getStackingStatsAtCycle = async (version, city, cycle) => {
  const url = `${CC_API_BASE}/${version}/${city}/stacking/get-stacking-stats-at-cycle/${cycle}/true`;
  try {
    const result = await fetchJson(url, enableLogs);
    return result;
  } catch (err) {
    console.log(`getStackingStatsAtCycle: ${err}`);
    return undefined;
  }
};

export const getMiningStatsAtBlock = async (version, city, block, signal = undefined) => {
  const url = `${CC_API_BASE}/${version}/${city}/mining/get-mining-stats-at-block/${block}/true`;
  try {
    return await fetchJson(url, enableLogs, signal ? signal : undefined);
  } catch (err) {
    console.log(`getMiningStatsAtBlock: ${err}`);
    return undefined;
  }
};

export const getCoinbaseAmount = async (version, city, block, signal = undefined) => {
  const url = `${CC_API_BASE}/${version}/${city}/token/get-coinbase-amount/${block}`;
  try {
    const result = await fetchJson(url, enableLogs, signal ? signal : undefined);
    return result.value;
  } catch (err) {
    console.log(`getCoinbaseAmount: ${err}`);
    return undefined;
  }
};
