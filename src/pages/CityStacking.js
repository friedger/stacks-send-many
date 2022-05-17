import { useAtom } from 'jotai';
import StackCityCoins from '../components/stacking/StackCityCoins';
import ClaimStackingRewards from '../components/stacking/ClaimStackingRewards';
import Unauthorized from '../components/common/Unauthorized';
import { userLoggedIn } from '../store/stacks';

export default function CityStacking() {
  const [signedIn] = useAtom(userLoggedIn);

  if (signedIn)
    return (
      <>
        <StackCityCoins />
        <ClaimStackingRewards />
      </>
    );

  return <Unauthorized />;
}
