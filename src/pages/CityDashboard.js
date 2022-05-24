import { useAtom } from 'jotai';
import NoCitySelected from '../components/common/NoCitySelected';
import MiningActivity from '../components/dashboard/MiningActivity';
import StackingActivity from '../components/dashboard/StackingActivity';
import { currentCityAtom } from '../store/cities';

export default function CityDashboard() {
  const [currentCity] = useAtom(currentCityAtom);

  return !currentCity.loaded ? (
    <NoCitySelected />
  ) : (
    <>
      <MiningActivity />
      <hr className="cc-divider" />
      <StackingActivity />
    </>
  );
}

// add token info here?
