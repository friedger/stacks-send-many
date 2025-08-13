import Client from '@walletconnect/sign-client';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import Auth from './components/Auth';
import { Network } from './components/Network';
import { Rate } from './components/Rate';
import { appMetaData, wcClientState } from './lib/auth';
import { router } from './router';
import metaverse from './styles/metaverse.png';

/* global BigInt */
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const styles = {
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundImage: `url(${metaverse})`,
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
      <nav className="navbar sticky-top navbar-dark text-light p-2" style={styles}>
        <a className="navbar-brand" href="/">
          <img src="/stacks.png" width="100" alt="Logo" />
        </a>
        <h1>Send Many</h1>
        <div className="d-flex d-sm-block justify-content-xs-around">
          <Rate />
          <Network />
          <Auth />
        </div>
      </nav>

      <RouterProvider router={router} />
    </>
  );
}
