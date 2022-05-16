import { fetchJson } from './common';

// enable console logging
const enableLogs = false;

// using develop branch until next release
const CC_API_BASE = `https://citycoins-api.citycoins.workers.dev`;
// const CC_API_BASE = `https://api.citycoins.co`;

// get a city's configuration file
export const getCityConfig = async (version, city) => {
  const url = `${CC_API_BASE}/tools/${version}/${city}/get-city-configuration`;
  return fetchJson(url, undefined, enableLogs);
};

export const getActivationBlock = async (version, city) => {
  const url = `${CC_API_BASE}/${version}/${city}/get-activation-block`;
  return fetchJson(url, undefined, enableLogs);
};

export const getCCBalance = async (version, city, address) => {
  const url = `${CC_API_BASE}/${version}/${city}/token/get-balance/${address}`;
  const result = await fetchJson(url, undefined, enableLogs);
  return result.value;
};
