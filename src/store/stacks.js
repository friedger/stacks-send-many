import { atom } from 'jotai';

export const loginStatusAtom = atom(false);
export const stxAddressAtom = atom({ loaded: false, data: '' });
export const appStxAddressAtom = atom({ loaded: false, data: '' });
export const stxBnsNameAtom = atom({ loaded: false, data: '' });
export const userBalancesAtom = atom({ loaded: false, data: {} });

export const currentStacksBlockAtom = atom({ loaded: false, data: 0 });
