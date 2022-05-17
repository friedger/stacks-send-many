import { useAtom } from 'jotai';
import StackCityCoins from '../components/stacking/StackCityCoins';
import ClaimStackingRewards from '../components/stacking/ClaimStackingRewards';
import Unauthorized from '../components/common/Unauthorized';
import { currentBlockHeight, userLoggedIn } from '../store/stacks';
import { useUpdateAtom } from 'jotai/utils';
import { useEffect } from 'react';
import { getBlockHeight } from '../lib/stacks';
import { currentCity } from '../store/cities';
import NoCitySelected from '../components/common/NoCitySelected';

export default function CityStacking() {
  const [signedIn] = useAtom(userLoggedIn);
  const [city] = useAtom(currentCity);
  const setBlockHeight = useUpdateAtom(currentBlockHeight);

  useEffect(() => {
    getBlockHeight().then(result => setBlockHeight(result));
  });

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
