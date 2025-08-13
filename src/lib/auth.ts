import { UserData } from '@stacks/connect';
import QRCodeModal from '@walletconnect/qrcode-modal';
import Client from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { chains } from './constants';

export const wcClientState = atom<Client | null>(null);

export const wcSessionState = atom<SessionTypes.Struct | null>(null);
export const userDataState = atom<UserData | null>(null);
export const authResponseState = atom<string | null>(null);
export const stacksConnectedState = atom<boolean>(false);
const authenticatedState = atom<boolean>(false);

export const appMetaData = {
  description: 'Send STX and sBTC to many users in one transaction.',
  url: 'https://sendstx.com',
  appDetails: {
    name: 'Send Many',
    icon: 'https://sendstx.com/android-icon-192x192.png',
  },
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
