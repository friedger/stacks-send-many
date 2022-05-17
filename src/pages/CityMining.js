import { useAtom } from 'jotai';
import MineCityCoins from '../components/mining/MineCityCoins';
import ClaimMiningRewards from '../components/mining/ClaimMiningRewards';
import Unauthorized from '../components/common/Unauthorized';
import { userLoggedIn } from '../store/stacks';

export default function CityMining() {
  const [signedIn] = useAtom(userLoggedIn);

  if (signedIn)
    return (
      <>
        <MineCityCoins />
        <ClaimMiningRewards />
      </>
    );

  return <Unauthorized />;
}
