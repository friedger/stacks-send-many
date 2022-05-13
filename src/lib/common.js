// async timer
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// fetch and return JSON from URL
// with set retry limit and timeout
export const fetchJson = async (url, count = 1, debug = false) => {
  const fetchLimit = 5;
  const fetchTimeout = 500;
  const response = await fetch(url);
  if (response.status === 200) {
    const json = await response.json();
    debug && console.log(`fetchJson result: ${json}`);
    return json;
  }
  if (count < fetchLimit) {
    await sleep(count * fetchTimeout);
    return fetchJson(url, count + 1);
  } else {
    throw new Error(`${response.status} ${response.statusText} ${url} (${count} attempts)`);
  }
};
