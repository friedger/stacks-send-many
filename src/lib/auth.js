import { useCallback } from 'react';
import { AppConfig, UserSession } from '@stacks/connect-react';
import { showConnect } from '@stacks/connect';
import { authOrigin } from './constants';
import { atom, useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSessionState = atom(new UserSession({ appConfig }));
export const userDataState = atom();
export const authResponseState = atom();

export const useConnect = () => {
  const [userSession] = useAtom(userSessionState);
  const setUserData = useUpdateAtom(userDataState);
  const setAuthResponse = useUpdateAtom(authResponseState);

  const onFinish = async payload => {
    setAuthResponse(payload.authResponse);
    const userData = await payload.userSession.loadUserData();
    setUserData(userData);
  };

  const authOptions = {
    authOrigin: authOrigin,
    onFinish,
    userSession, // usersession is already in state, provide it here
    redirectTo: '/',
    manifestPath: '/manifest.json',
    appDetails: {
      name: 'CityCoins',
      icon: 'https://cdn-y2e8.pages.dev/logos/citycoin-blue-192x192.png',
    },
  };

  const handleOpenAuth = () => {
    showConnect(authOptions);
  };

  const handleSignOut = useCallback(() => {
    userSession?.signUserOut("/");
  }, [userSession]);

  return { handleOpenAuth, handleSignOut, authOptions };
};
