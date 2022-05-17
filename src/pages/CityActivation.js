import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useEffect } from 'react';
import RegisterUser from '../components/activation/RegisterUser';
import NoCitySelected from '../components/common/NoCitySelected';
import Unauthorized from '../components/common/Unauthorized';
import { getBlockHeight } from '../lib/stacks';
import { currentCity } from '../store/cities';
import { currentBlockHeight, userLoggedIn } from '../store/stacks';

export default function CityActivation() {
  const [signedIn] = useAtom(userLoggedIn);
  const [city] = useAtom(currentCity);
  const setBlockHeight = useUpdateAtom(currentBlockHeight);

  useEffect(() => {
    getBlockHeight().then(result => setBlockHeight(result));
  }, [setBlockHeight]);

  return city === '' ? <NoCitySelected /> : signedIn ? <RegisterUser /> : <Unauthorized />;
}
