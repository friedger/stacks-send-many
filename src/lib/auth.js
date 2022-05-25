import { useCallback } from 'react';
import { AppConfig, UserSession } from '@stacks/connect-react';
import { showConnect } from '@stacks/connect';
import { atom, useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import {
  appStxAddressAtom,
  stxBnsNameAtom,
  loginStatusAtom,
  stxAddressAtom,
} from '../store/stacks';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSessionStateAtom = atom(new UserSession({ appConfig }));
export const userDataStateAtom = atom();
export const authResponseStateAtom = atom();

export const useConnect = () => {
  const [userSession] = useAtom(userSessionStateAtom);
  const setUserData = useUpdateAtom(userDataStateAtom);
  const setAuthResponse = useUpdateAtom(authResponseStateAtom);
  const setLoginStatus = useUpdateAtom(loginStatusAtom);
  const setStxAddress = useUpdateAtom(stxAddressAtom);
  const setAppStxAddress = useUpdateAtom(appStxAddressAtom);
  const setBnsName = useUpdateAtom(stxBnsNameAtom);

  const onFinish = async payload => {
    setAuthResponse(payload.authResponse);
    const userData = await payload.userSession.loadUserData();
    setUserData(userData);
    setLoginStatus(true);
  };

  const authOptions = {
    onFinish,
    userSession, // usersession is already in state, provide it here
    redirectTo: '/',
    manifestPath: '/manifest.json',
    appDetails: {
      name: 'CityCoins',
      icon: 'https://minecitycoins.com/CityCoins_Logo_150x150.png',
    },
  };

  const handleOpenAuth = () => {
    showConnect(authOptions);
  };

  const handleSignOut = useCallback(() => {
    setLoginStatus(false);
    setStxAddress('');
    setAppStxAddress('');
    setBnsName('');
    userSession?.signUserOut('/');
  }, [setAppStxAddress, setBnsName, setLoginStatus, setStxAddress, userSession]);

  return { handleOpenAuth, handleSignOut, authOptions };
};
