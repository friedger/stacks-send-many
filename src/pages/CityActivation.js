import { useAtom } from 'jotai';
import RegisterUser from '../components/activation/RegisterUser';
import NoCitySelected from '../components/common/NoCitySelected';
import Unauthorized from '../components/common/Unauthorized';
import { currentCity } from '../store/cities';
import { userLoggedIn } from '../store/stacks';

export default function CityActivation() {
  const [signedIn] = useAtom(userLoggedIn);
  const [city] = useAtom(currentCity);

  return city === '' ? <NoCitySelected /> : signedIn ? <RegisterUser /> : <Unauthorized />;
}
