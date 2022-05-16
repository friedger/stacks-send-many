import { atom } from 'jotai';

export const currentBlockHeight = atom(0);

export const userStxAddress = atom('');
export const userAppStxAddress = atom('');
export const userLoggedIn = atom(false);
export const userBnsName = atom({
  loaded: false,
  data: '',
});
export const userBalances = atom({
  loaded: false,
  data: {},
});
