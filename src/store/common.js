import { atom } from 'jotai';

export const currentBlockHeight = atom(0);
export const currentCity = atom('');
export const currentCitySymbol = atom('');

export const cityList = atom(['Austin', 'Miami', 'New York City', 'San Francisco']);
