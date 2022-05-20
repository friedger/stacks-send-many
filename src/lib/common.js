import throttledQueue from 'throttled-queue';

let requestCount = 0;

const throttle = throttledQueue(4, 1000, true); // at most 4 requests per second

// async timer
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// fetch and return JSON from URL
export const fetchJson = async (url, debug = false) => {
  const response = await throttle(() => fetch(url));
  console.log(`requests: ${++requestCount}`);
  //console.log(`status: ${response.status}`);
  if (response.status === 200) {
    const json = await response.json();
    //console.log(`json: ${JSON.stringify(json)}`);
    return json;
  }
  throw new Error(`fetchJson: ${url} ${response.status} ${response.statusText}`);
};
