// async timer
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// fetch and return JSON from URL
// with set retry limit and timeout
export const fetchJson = async (url, debug = false, signal = undefined) => {
  const fetchTimeout = 500;
  await sleep(fetchTimeout);
  const response = await fetch(url, signal ? { signal } : undefined).catch(err => {
    if (err.name === 'AbortError') {
      return undefined;
    }
    throw new Error(`fetchJson: unknown ${err}`);
  });
  if (response.status === 200) {
    const json = await response.json();
    debug && console.log(`fetchJson result: ${JSON.stringify(json)}`);
    return json;
  }
  throw new Error(`fetchJson: ${response.status} ${response.statusText} ${url}`);
};
