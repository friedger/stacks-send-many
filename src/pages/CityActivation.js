import { useAtom } from 'jotai';
import RegisterUser from '../components/activation/RegisterUser';
import Unauthorized from '../components/common/Unauthorized';
import { userLoggedIn } from '../store/stacks';

export default function CityActivation() {
  const [signedIn] = useAtom(userLoggedIn);

  if (signedIn) return <RegisterUser />;

  return <Unauthorized />;
}
