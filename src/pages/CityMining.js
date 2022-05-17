import { useAtom } from 'jotai';
import MineCityCoins from '../components/mining/MineCityCoins';
import ClaimMiningRewards from '../components/mining/ClaimMiningRewards';
import Unauthorized from '../components/common/Unauthorized';
import { currentBlockHeight, userLoggedIn } from '../store/stacks';
import { useUpdateAtom } from 'jotai/utils';
import { useEffect } from 'react';
import { getBlockHeight } from '../lib/stacks';
import NoCitySelected from '../components/common/NoCitySelected';
import { currentCity } from '../store/cities';

export default function CityMining() {
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
      <MineCityCoins />
      <ClaimMiningRewards />
    </>
  ) : (
    <Unauthorized />
  );
}
