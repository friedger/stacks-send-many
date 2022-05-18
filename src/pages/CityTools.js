import { useAtom } from 'jotai';
import ComingSoon from '../components/common/ComingSoon';
import NoCitySelected from '../components/common/NoCitySelected';
import Unauthorized from '../components/common/Unauthorized';
import { currentCityAtom } from '../store/cities';
import { loginStatusAtom } from '../store/stacks';

export default function CityTools() {
  const [loginStatus] = useAtom(loginStatusAtom);
  const [currentCity] = useAtom(currentCityAtom);

  return !currentCity.loaded ? <NoCitySelected /> : loginStatus ? <ComingSoon /> : <Unauthorized />;
}
