import { fetchJson, debugLog } from './common';

// using develop branch until next release
// const CC_API_BASE = `https://citycoins-api.citycoins.workers.dev`;
const CC_API_BASE = `https://api.citycoins.co`;

// get a city's configuration file
export const getCityConfig = async (version, city) => {
  const url = `${CC_API_BASE}/tools/${version}/${city}/get-city-configuration`;
  return await fetchJson(url);
};

export const getActivationBlock = async (version, city) => {
  const url = `${CC_API_BASE}/${version}/${city}/get-activation-block`;
  return await fetchJson(url);
};

export const getCCBalance = async (version, city, address) => {
  const url = `${CC_API_BASE}/${version}/${city}/token/get-balance/${address}`;
  const result = await fetchJson(url);
  return result.value;
};

export const getRewardCycle = async (version, city, block = undefined) => {
  const url = `${CC_API_BASE}/${version}/${city}/stacking/get-reward-cycle/${
    block ? block : 'current'
  }`;
  try {
    const result = await fetchJson(url);
    return result.value;
  } catch (err) {
    debugLog(`getRewardCycle: ${err}`);
    return undefined;
  }
};

export const getUserId = async (version, city, address) => {
  const url = `${CC_API_BASE}/${version}/${city}/activation/get-user-id/${address}`;
  try {
    const result = await fetchJson(url);
    return result.value;
  } catch (err) {
    debugLog(`getUserId: ${err}`);
    return undefined;
  }
};

export const getFirstStacksBlockInRewardCycle = async (version, city, cycle) => {
  const url = `${CC_API_BASE}/${version}/${city}/stacking/get-first-stacks-block-in-reward-cycle/${cycle}`;
  try {
    const result = await fetchJson(url);
    return result.value;
  } catch (err) {
    debugLog(`getFirstStacksBlockInRewardCycle: ${err}`);
    return undefined;
  }
};

export const getStackingStatsAtCycle = async (version, city, cycle) => {
  const url = `${CC_API_BASE}/${version}/${city}/stacking/get-stacking-stats-at-cycle/${cycle}/true`;
  try {
    const result = await fetchJson(url);
    return result;
  } catch (err) {
    debugLog(`getStackingStatsAtCycle: ${err}`);
    return undefined;
  }
};

export const getMiningStatsAtBlock = async (version, city, block) => {
  const url = `${CC_API_BASE}/${version}/${city}/mining/get-mining-stats-at-block/${block}/true`;
  try {
    return await fetchJson(url);
  } catch (err) {
    debugLog(`getMiningStatsAtBlock: ${err}`);
    return undefined;
  }
};

export const getCoinbaseAmount = async (version, city, block) => {
  const url = `${CC_API_BASE}/${version}/${city}/token/get-coinbase-amount/${block}`;
  try {
    const result = await fetchJson(url);
    return result.value;
  } catch (err) {
    debugLog(`getCoinbaseAmount: ${err}`);
    return undefined;
  }
};

export const isBlockWinner = async (version, city, block, address) => {
  const url = `${CC_API_BASE}/${version}/${city}/mining-claims/is-block-winner/${block}/${address}`;
  try {
    const result = await fetchJson(url);
    return result.value;
  } catch (err) {
    debugLog(`isBlockWinner: ${err}`);
    return undefined;
  }
};

export const canClaimMiningReward = async (version, city, block, address) => {
  const url = `${CC_API_BASE}/${version}/${city}/mining-claims/can-claim-mining-reward/${block}/${address}`;
  try {
    const result = await fetchJson(url);
    return result.value;
  } catch (err) {
    debugLog(`canClaimMiningReward: ${err}`);
    return undefined;
  }
};

// https://api.citycoins.co/{version}/{cityname}/stacking/get-stacker-at-cycle/{cycleid}/{userid}/{default}
export const getStackerAtCycle = async (version, city, cycle, userId) => {
  const url = `${CC_API_BASE}/${version}/${city}/stacking/get-stacker-at-cycle/${cycle}/${userId}/true`;
  try {
    const result = await fetchJson(url);
    return result;
  } catch (err) {
    debugLog(`getStackerAtCycle: ${err}`);
    return undefined;
  }
};

// https://api.citycoins.co/{version}/{cityname}/stacking-claims/get-stacking-reward/{cycleid}/{userid}
export const getStackingReward = async (version, city, cycle, userId) => {
  const url = `${CC_API_BASE}/${version}/${city}/stacking-claims/get-stacking-reward/${cycle}/${userId}`;
  try {
    const result = await fetchJson(url);
    return result.value;
  } catch (err) {
    debugLog(`getStackingReward: ${err}`);
    return undefined;
  }
};
