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
      <ClaimStackingRewards />
    </>
  ) : (
    <Unauthorized />
  );
}
