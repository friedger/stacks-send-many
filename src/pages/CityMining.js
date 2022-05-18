import { useAtom } from 'jotai';
import MineCityCoins from '../components/mining/MineCityCoins';
import ClaimMiningRewards from '../components/mining/ClaimMiningRewards';
import Unauthorized from '../components/common/Unauthorized';
import { userLoggedIn } from '../store/stacks';
import NoCitySelected from '../components/common/NoCitySelected';
import { currentCity } from '../store/cities';

export default function CityMining() {
  const [signedIn] = useAtom(userLoggedIn);
  const [city] = useAtom(currentCity);

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
