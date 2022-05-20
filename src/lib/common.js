import throttledQueue from 'throttled-queue';

// flags to enable console logging from all functions
const ENABLE_LOGS = false;

// helper to simplify consistent logging
export const debugLog = msg => ENABLE_LOGS && console.log(msg);

// at most 4 requests per second
const throttle = throttledQueue(4, 1000, true);

// async timer
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// fetch and return JSON from URL
export const fetchJson = async url => {
  debugLog(`fetchJson: ${url}`);
  const response = await throttle(() => fetch(url));
  if (response.status === 200) {
    const json = await response.json();
    debugLog(`fetchJson: ${json}`);
    return json;
  }
  throw new Error(`fetchJson: ${url} ${response.status} ${response.statusText}`);
};
