import { AuthOptions, UserData, showConnect } from '@stacks/connect';
import { AppConfig, UserSession } from '@stacks/connect-react';
import QRCodeModal from '@walletconnect/qrcode-modal';
import Client from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { chains } from './constants';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSessionState = atom(new UserSession({ appConfig }));
export const wcClientState = atom<Client | null>(null);

export const wcSessionState = atom<SessionTypes.Struct | null>(null);
export const userDataState = atom<UserData | null>(null);
export const authResponseState = atom<string | null>(null);
const authenticatedState = atom<boolean>(false);

export const appMetaData = {
  description: 'Send STX and sBTC to many users in one transaction.',
  url: 'https://sendstx.com',
  appDetails: {
    name: 'Send Many',
    icon: 'https://sendstx.com/android-icon-192x192.png',
  },
};

export const useConnect = () => {
  const userSession = useAtomValue(userSessionState);
  const setUserData = useSetAtom(userDataState);
  const setAuthResponse = useSetAtom(authResponseState);
  const [authenticated, setAuthenticated] = useAtom(authenticatedState);

  const authOptions: AuthOptions = {
    onFinish: payload => {
      setAuthResponse(payload.authResponse);
      setAuthenticated(true);
      const userData = payload.userSession.loadUserData();
      setUserData(userData);
    },
    userSession, // usersession is already in state, provide it here
    redirectTo: '/',
    manifestPath: '/manifest.json',
    appDetails: appMetaData.appDetails,
  };

  const handleOpenAuth = () => {
    showConnect(authOptions);
  };

  const handleSignOut = useCallback(() => {
    setAuthenticated(false);
    userSession?.signUserOut('/');
  }, [userSession, setAuthenticated]);

  return { handleOpenAuth, handleSignOut, authOptions, userSession, authenticated };
};

export const useWcConnect = () => {
  const client = useAtomValue(wcClientState);
  const setWcSession = useSetAtom(wcSessionState);
  const [authenticated, setAuthenticated] = useAtom(authenticatedState);

  const handleWcOpenAuth = async () => {
    if (client) {
      const { uri, approval } = await client.connect({
        pairingTopic: undefined,
        requiredNamespaces: {
          stacks: {
            methods: ['stacks_contractCall'],
            chains: chains,
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
        setAuthenticated(true);
        QRCodeModal.close();
      }
    } else {
      return Promise.reject('wallect connect client not ready');
    }
  };

  const isWcReady = useCallback(() => {
    return client !== undefined && client !== null;
  }, [client]);

  return { handleWcOpenAuth, authenticated, isWcReady, client };
};
