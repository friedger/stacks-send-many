import Client from '@walletconnect/sign-client';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Footer } from './components/Footer';
import { appMetaData, wcClientState } from './lib/auth';
import { router } from './router';

/* global BigInt */
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export default function App() {
  const [wcClient, setWcClient] = useAtom(wcClientState);

  useEffect(() => {
    const f = async () => {
      const c = await Client.init({
        logger: 'debug',
        relayUrl: 'wss://relay.walletconnect.com',
        projectId: 'd0c1b8c866cfccbd943f1e06e7d088f4',
        metadata: {
          name: appMetaData.appDetails.name,
          description: appMetaData.description,
          url: appMetaData.url,
          icons: [appMetaData.appDetails.icon],
        },
      });

      setWcClient(c);
    };

    if (wcClient === undefined) {
      f();
    }
  }, [wcClient, setWcClient]);

  return (
    <>
      <main className="main-content">
        <RouterProvider router={router} />
      </main>
      <Footer />
    </>
  );
}
