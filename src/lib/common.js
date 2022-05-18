// async timer
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// fetch and return JSON from URL
// with set retry limit and timeout
export const fetchJson = async (url, debug = false, signal = undefined, count = 1) => {
  const fetchLimit = 5;
  const fetchTimeout = 500;
  await sleep(count * fetchTimeout);
  const response = await fetch(url, signal ? { signal } : undefined).catch(err => {
    if (err.name === 'AbortError') {
      throw new Error(`fetchJson Aborted: ${url}`);
    } else {
      throw new Error(err);
    }
  });
  if (response.status === 200) {
    const json = await response.json();
    debug && console.log(`fetchJson result: ${JSON.stringify(json)}`);
    return json;
  }
  if (count < fetchLimit) {
    return fetchJson(url, count + 1);
  } else {
    throw new Error(`${response.status} ${response.statusText} ${url} (${count} attempts)`);
  }
};
