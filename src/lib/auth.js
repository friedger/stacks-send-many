import { useCallback } from 'react';
import { AppConfig, UserSession } from '@stacks/connect-react';
import { showConnect } from '@stacks/connect';
import { authOrigin, mainnet } from './constants';
import { atom, useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import QRCodeModal from '@walletconnect/qrcode-modal';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSessionState = atom(new UserSession({ appConfig }));
export const userDataState = atom();
export const authResponseState = atom();
export const appMetaData = {
  description: 'Send STX and xBTC to many users in one transaction.',
  url: 'https://sendstx.com',
  appDetails: {
    name: 'Send Many',
    icon: 'https://sendstx.com/android-icon-192x192.png',
  },
};

export const chains = ['stacks:1', 'stacks:2147483648'];

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
    appDetails: appMetaData.appDetails,
  };

  const handleOpenAuth = () => {
    showConnect(authOptions);
  };

  const handleSignOut = useCallback(() => {
    userSession?.signUserOut('/');
  }, [userSession]);

  return { handleOpenAuth, handleSignOut, authOptions };
};

export const useWcConnect = ({ client, wcSession, setWcSession }) => {
  const handleWcOpenAuth = async () => {
    const { uri, approval } = await client.connect({
      pairingTopic: undefined,
      requiredNamespaces: {
        stacks: {
          methods: ['stacks_contractCall'],
          chains: [mainnet ? chains[0] : chains[1]],
          events: [],
        },
      },
    });

    if (uri) {
      QRCodeModal.open(uri, () => {
        console.log('QR Code Modal closed');
      });
      const session = await approval();
      setWcSession(session);
      QRCodeModal.close();
    }
  };
  return { handleWcOpenAuth };
};
