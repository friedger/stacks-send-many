import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useEffect } from 'react';
import ComingSoon from '../components/common/ComingSoon';
import NoCitySelected from '../components/common/NoCitySelected';
import Unauthorized from '../components/common/Unauthorized';
import { getBlockHeight } from '../lib/stacks';
import { currentCity } from '../store/cities';
import { currentBlockHeight, userLoggedIn } from '../store/stacks';

export default function CityTools() {
  const [signedIn] = useAtom(userLoggedIn);
  const [city] = useAtom(currentCity);
  const setBlockHeight = useUpdateAtom(currentBlockHeight);

  useEffect(() => {
    getBlockHeight().then(result => setBlockHeight(result));
  });

  return city === '' ? <NoCitySelected /> : signedIn ? <ComingSoon /> : <Unauthorized />;
}
