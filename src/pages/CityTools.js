import { useAtom } from 'jotai';
import ComingSoon from '../components/common/ComingSoon';
import Unauthorized from '../components/common/Unauthorized';
import { userLoggedIn } from '../store/stacks';

export default function CityTools() {
  const [signedIn] = useAtom(userLoggedIn);

  if (signedIn) return <ComingSoon />;

  return <Unauthorized />;
}
