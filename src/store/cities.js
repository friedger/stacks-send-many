import { atom } from 'jotai';
import AustinCoin from '../images/ATX_StandAlone.svg';
import MiamiCoin from '../images/MIA_StandAlone.svg';
import NewYorkCityCoin from '../images/NYC_StandAlone.svg';
import SanFranciscoCoin from '../images/SFO_StandAlone.svg';

export const cityList = atom({
  atx: {
    name: 'Austin',
    symbol: 'ATX',
    logo: AustinCoin,
  },
  mia: {
    name: 'Miami',
    symbol: 'MIA',
    logo: '',
    versions: ['v1', 'v2'],
    currentVersion: 'v2',
  },
  nyc: {
    name: 'New York City',
    symbol: 'NYC',
    logo: '',
    versions: ['v1', 'v2'],
    currentVersion: 'v2',
  },
  sfo: {
    name: 'San Francisco',
    symbol: 'SFO',
    logo: '',
    versions: null,
    currentVersion: null,
  },
});

export const cityConfig = atom({
  init: false,
  value: {
    atx: {},
    mia: {},
    nyc: {},
    sfo: {},
  },
});
