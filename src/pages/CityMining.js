import { useAtom } from 'jotai';
import MineCityCoins from '../components/mining/MineCityCoins';
import ClaimMiningRewards from '../components/mining/ClaimMiningRewards';
import Unauthorized from '../components/common/Unauthorized';
import { loginStatusAtom } from '../store/stacks';
import NoCitySelected from '../components/common/NoCitySelected';
import { currentCityAtom } from '../store/cities';

export default function CityMining() {
  const [loginStatus] = useAtom(loginStatusAtom);
  const [currentCity] = useAtom(currentCityAtom);

  return !currentCity.loaded ? (
    <NoCitySelected />
  ) : loginStatus ? (
    <>
      <MineCityCoins />
      <ClaimMiningRewards />
    </>
  ) : (
    <Unauthorized />
  );
}
