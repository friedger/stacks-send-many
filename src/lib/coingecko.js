// fetches and returns the current price from CoinGecko
// for a provided coin ID
export async function updateStxRate() {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=blockstack&vs_currencies=USD&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false`;
  const result = await fetch(url);
  const json = await result.json();
  return json.blockstack.usd;
}

// generalized version
export async function updateRate(coingeckoId) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=USD&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false`;
  const result = await fetch(url);
  const json = await result.json();
  return json[coingeckoId].usd;
}
