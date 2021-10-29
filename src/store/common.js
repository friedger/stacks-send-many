import { atom } from 'jotai';
import CityCoin from '../images/CC_StandAlone.svg';
import AustinCoin from '../images/ATX_StandAlone.svg';
import MiamiCoin from '../images/MIA_StandAlone.svg';
import NewYorkCityCoin from '../images/NYC_StandAlone.svg';
import SanFranciscoCoin from '../images/SFO_StandAlone.svg';

// STACKS

export const currentBlockHeight = atom(0);

// GENERAL

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

export const currentCity = atom('');
export const currentCitySymbol = atom('');
export const CITYCOIN_VRF = 'citycoin-vrf';
