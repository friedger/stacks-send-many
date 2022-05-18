import { useAtom } from 'jotai';
import NoCitySelected from '../components/common/NoCitySelected';
import MiningActivity from '../components/dashboard/MiningActivity';
import StackingActivity from '../components/dashboard/StackingActivity';
import { currentCity } from '../store/cities';

export default function CityDashboard() {
  const [city] = useAtom(currentCity);

  return city === '' ? (
    <NoCitySelected />
  ) : (
    <>
      <MiningActivity />
      <StackingActivity />
    </>
  );
}
