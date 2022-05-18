import { useAtom } from 'jotai';
import StackCityCoins from '../components/stacking/StackCityCoins';
import ClaimStackingRewards from '../components/stacking/ClaimStackingRewards';
import Unauthorized from '../components/common/Unauthorized';
import { userLoggedIn } from '../store/stacks';
import { currentCity } from '../store/cities';
import NoCitySelected from '../components/common/NoCitySelected';

export default function CityStacking() {
  const [signedIn] = useAtom(userLoggedIn);
  const [city] = useAtom(currentCity);

  return city === '' ? (
    <NoCitySelected />
  ) : signedIn ? (
    <>
      <StackCityCoins />
      <ClaimStackingRewards />
    </>
  ) : (
    <Unauthorized />
  );
}
