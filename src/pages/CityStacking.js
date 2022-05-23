import { useAtom } from 'jotai';
import StackCityCoins from '../components/stacking/StackCityCoins';
import ClaimStackingRewards from '../components/stacking/ClaimStackingRewards';
import Unauthorized from '../components/common/Unauthorized';
import { loginStatusAtom } from '../store/stacks';
import { currentCityAtom } from '../store/cities';
import NoCitySelected from '../components/common/NoCitySelected';

export default function CityStacking() {
  const [loginStatus] = useAtom(loginStatusAtom);
  const [currentCity] = useAtom(currentCityAtom);

  return !currentCity.loaded ? (
    <NoCitySelected />
  ) : loginStatus ? (
    <>
      <StackCityCoins />
      <hr className="cc-divider" />
      <ClaimStackingRewards />
    </>
  ) : (
    <Unauthorized />
  );
}

// STATES
// auth contract not initialized
// core contract registration active
// core contract activation delay
// core contract activated

// INFO
// current cycle
// cycle length: 2,100 blocks ~2 weeks
// max cycles: 32 cycles ~16 months
// city balance (selected)
// stacking stats atom? filter to current/next cycle?
// same stacking info used in full profile

// STACKING
// user: already mining?
// list of quick tips
// city claimed contribution (CITY_INFO?)

// STACKING CLAIM
// enter cycle, chooses contract

// Eventually... search past cycles. Add buttons.

// + Docs links
