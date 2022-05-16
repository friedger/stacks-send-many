import { atom } from 'jotai';

export const currentCity = atom('');
export const currentCitySymbol = atom('');
export const currentRewardCycle = atom(undefined);

export const currentCityInitialized = atom(false);
export const currentCityActivationStatus = atom(false);
export const currentCityStartBlock = atom(0);

export const userId = atom(0);
