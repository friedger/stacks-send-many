import { useAtom } from 'jotai';
import ComingSoon from '../components/common/ComingSoon';
import NoCitySelected from '../components/common/NoCitySelected';
import Unauthorized from '../components/common/Unauthorized';
import { currentCity } from '../store/cities';
import { userLoggedIn } from '../store/stacks';

export default function CityTools() {
  const [signedIn] = useAtom(userLoggedIn);
  const [city] = useAtom(currentCity);

  return city === '' ? <NoCitySelected /> : signedIn ? <ComingSoon /> : <Unauthorized />;
}
