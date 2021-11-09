import { atom } from 'jotai';
import CityCoin from '../images/CC_StandAlone.svg';
import AustinCoin from '../images/ATX_StandAlone.svg';
import MiamiCoin from '../images/MIA_StandAlone.svg';
import NewYorkCityCoin from '../images/NYC_StandAlone.svg';
import SanFranciscoCoin from '../images/SFO_StandAlone.svg';

// STACKS

export const currentBlockHeight = atom(0);

// CITYCOINS

export const CityCoinLogo = CityCoin;
export const AustinCoinLogo = AustinCoin;
export const MiamiCoinLogo = MiamiCoin;
export const NewYorkCityCoinLogo = NewYorkCityCoin;
export const SanFranciscoCoinLogo = SanFranciscoCoin;

export const currentCityList = {
  0: { name: 'Austin', symbol: 'ATX', logo: AustinCoinLogo },
  1: { name: 'Miami', symbol: 'MIA', logo: MiamiCoinLogo },
  2: { name: 'New York City', symbol: 'NYC', logo: NewYorkCityCoinLogo },
  3: { name: 'San Francisco', symbol: 'SFO', logo: SanFranciscoCoinLogo },
};

export const stxBalanceAtom = atom(0);

export const cityBalancesAtom = atom({
  ATX: 0,
  MIA: 0,
  NYC: 0,
  SFO: 0,
});

export const stxRateAtom = atom(0);

export const cityRatesAtom = atom({
  ATX: 0,
  MIA: 0,
  NYC: 0,
  SFO: 0,
});

export const currentCity = atom('');
export const currentCitySymbol = atom('');
export const currentRewardCycle = atom(undefined);

export const currentCityInitialized = atom(false);
export const currentCityActivationStatus = atom(false);
export const currentCityStartBlock = atom(0);

export const userId = atom(0);
