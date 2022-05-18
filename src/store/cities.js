import { atom } from 'jotai';
import CityCoin from '../images/CC_StandAlone.svg';
import MiamiCoin from '../images/MIA_StandAlone.svg';
import MiamiBG from '../images/MIA_BG_Horizontal.svg';
import NewYorkCityCoin from '../images/NYC_StandAlone.svg';
import NewYorkCityBG from '../images/NYC_BG_Horizontal.svg';

export const CityCoinLogo = CityCoin;

export const rewardCycleLength = 2100;

export const cityActions = ['Dashboard', 'Activation', 'Mining', 'Stacking', 'Tools'];
export const currentAction = atom('');

export const currentRewardCycle = atom(0);

// Stats
export const miningStatsPerBlock = atom([]);
export const stackingStatsPerCycle = atom([]);

// setup to match endpoints in CityCoins API
// but hardcoded to reduce number of lookups
// and includes logo and bg for each city

export const currentCity = atom('');
export const cityList = atom(['mia', 'nyc']);

export const cityInfo = atom({
  mia: {
    name: 'Miami',
    symbol: 'MIA',
    logo: MiamiCoin,
    background: MiamiBG,
    bgText: 'dark',
    versions: ['v1', 'v2'],
    currentVersion: 'v2',
  },
  nyc: {
    name: 'New York City',
    symbol: 'NYC',
    logo: NewYorkCityCoin,
    background: NewYorkCityBG,
    bgText: 'white',
    versions: ['v1', 'v2'],
    currentVersion: 'v2',
  },
});

export const cityConfig = atom({
  mia: {
    v1: {
      cityName: 'Miami',
      deployed: true,
      deployer: 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27',
      auth: { name: 'miamicoin-auth', initialized: true },
      core: {
        name: 'miamicoin-core-v1',
        activated: false,
        startBlock: 24497,
        shutdown: true,
        shutdownBlock: 58917,
      },
      token: {
        name: 'miamicoin-token',
        activated: true,
        activationBlock: 24497,
        displayName: 'MiamiCoin',
        tokenName: 'miamicoin',
        symbol: 'MIA',
        decimals: 0,
        logo: 'https://cdn.citycoins.co/logos/miamicoin.png',
        uri: 'https://cdn.citycoins.co/metadata/miamicoin.json',
      },
    },
    v2: {
      cityName: 'Miami',
      deployed: true,
      deployer: 'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R',
      auth: { name: 'miamicoin-auth-v2', initialized: true },
      core: { name: 'miamicoin-core-v2', activated: true, startBlock: 58921, shutdown: false },
      token: {
        name: 'miamicoin-token-v2',
        activated: true,
        activationBlock: 24497,
        displayName: 'MiamiCoin',
        tokenName: 'miamicoin',
        symbol: 'MIA',
        decimals: 6,
        logo: 'https://cdn.citycoins.co/logos/miamicoin.png',
        uri: 'https://cdn.citycoins.co/metadata/miamicoin.json',
      },
    },
  },
  nyc: {
    v1: {
      cityName: 'New York City',
      deployed: true,
      deployer: 'SP2H8PY27SEZ03MWRKS5XABZYQN17ETGQS3527SA5',
      auth: { name: 'newyorkcitycoin-auth', initialized: true },
      core: {
        name: 'newyorkcitycoin-core-v1',
        activated: false,
        startBlock: 37449,
        shutdown: true,
        shutdownBlock: 58922,
      },
      token: {
        name: 'newyorkcitycoin-token',
        activated: true,
        activationBlock: 37449,
        displayName: 'NewYorkCityCoin',
        tokenName: 'newyorkcitycoin',
        symbol: 'NYC',
        decimals: 0,
        logo: 'https://cdn.citycoins.co/logos/newyorkcitycoin.png',
        uri: 'https://cdn.citycoins.co/metadata/newyorkcitycoin.json',
      },
    },
    v2: {
      cityName: 'New York City',
      deployed: true,
      deployer: 'SPSCWDV3RKV5ZRN1FQD84YE1NQFEDJ9R1F4DYQ11',
      auth: { name: 'newyorkcitycoin-auth-v2', initialized: true },
      core: {
        name: 'newyorkcitycoin-core-v2',
        activated: true,
        startBlock: 58925,
        shutdown: false,
      },
      token: {
        name: 'newyorkcitycoin-token-v2',
        activated: true,
        activationBlock: 37449,
        displayName: 'NewYorkCityCoin',
        tokenName: 'newyorkcitycoin',
        symbol: 'NYC',
        decimals: 6,
        logo: 'https://cdn.citycoins.co/logos/newyorkcitycoin.png',
        uri: 'https://cdn.citycoins.co/metadata/newyorkcitycoin.json',
      },
    },
  },
});
