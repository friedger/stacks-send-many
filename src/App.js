import { Router } from '@reach/router';
import { Connect } from '@stacks/connect-react';
import Client from '@walletconnect/sign-client';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import Auth from './components/Auth';
import { Network } from './components/Network';
import { Rate } from './components/Rate';
import { appMetaData, useConnect, useWcConnect, userDataState, wcClientState } from './lib/auth';
import { useStxAddresses, useWalletConnect } from './lib/hooks';
import FulfillmentSBtc from './pages/FulfillmentSBtc';
import Landing from './pages/Landing';
import SendMany from './pages/SendMany';
import SendManyAdvocates from './pages/SendManyAdvocates';
import SendManyCyclePayout from './pages/SendManyCyclePayout';
import SendManyDetails from './pages/SendManyDetails';
import SendManyTransferDetails from './pages/SendManyTransferDetails';
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

export default function App(props) {
  const { authOptions, userSession } = useConnect();
  const [, setUserData] = useAtom(userDataState);
  const [wcClient, setWcClient] = useAtom(wcClientState);
  useEffect(() => {
    if (userSession?.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn();
    }
  }, [userSession, setUserData]);

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
    <Connect authOptions={authOptions}>
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

      <Content />
    </Connect>
  );
}

function AppBody(props) {
  return <div>{props.children}</div>;
}
function Content() {
  const { ownerStxAddress } = useStxAddresses();
  const { wcSession } = useWalletConnect();
  const { client, isWcReady } = useWcConnect();
  console.log({ ownerStxAddress, wcSession, client, wcReady: isWcReady() });
  return (
    <>
      <Router>
        <AppBody path="/">
          <SendManyCyclePayout path="/cycle/:cycleId" />
          <SendManyAdvocates path="/advocates/:payoutId" />
          <SendManyDetails path="/txid/:txId" />
          <SendManyTransferDetails path="/txid/:txId/:eventIndex" />
          {!ownerStxAddress && <Landing path="/" />}
          {ownerStxAddress && (
            <>
              <SendMany path="/xbtc" asset="xbtc" />
              <SendMany path="/wmno" asset="wmno" />
              <SendMany path="/sbtc/:assetContract/:sendManyContract" asset="sbtc" />
              <SendManyCyclePayout path="/cycle/:cycleId" />
              <SendMany path="/" default asset="stx" />
              <FulfillmentSBtc path="/sbtc-bridge/:assetContract/:sendManyContract" />
            </>
          )}
        </AppBody>
      </Router>
    </>
  );
}
