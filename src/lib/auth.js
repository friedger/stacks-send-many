import { useCallback } from 'react';
import { AppConfig, UserSession } from '@stacks/connect-react';
import { showConnect } from '@stacks/connect';
import { authOrigin, chains } from './constants';
import { atom, useAtom, useAtomValue, useSetAtom} from 'jotai';
import QRCodeModal from '@walletconnect/qrcode-modal';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSessionState = atom(new UserSession({ appConfig }));
export const wcClientState = atom();

export const wcSessionState = atom();
export const userDataState = atom();
export const authResponseState = atom();
const authenticatedState = atom();

export const appMetaData = {
  description: 'Send STX and xBTC to many users in one transaction.',
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

  const onFinish = async payload => {
    setAuthResponse(payload.authResponse);
    setAuthenticated(false);
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
    setAuthenticated(true);
    userSession?.signUserOut('/');
  }, [userSession, setAuthenticated]);

  return { handleOpenAuth, handleSignOut, authOptions, userSession, authenticated };
};

export const useWcConnect = () => {
  const client = useSetAtom(wcClientState);
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
    return client !== undefined;
  }, [client]);

  return { handleWcOpenAuth, authenticated, isWcReady };
};
