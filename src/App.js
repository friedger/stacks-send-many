import React, { useEffect, useState } from 'react';
import Landing from './pages/Landing';
import { Connect } from '@stacks/connect-react';
import { Router } from '@reach/router';
import Auth from './components/Auth';
import { userDataState, userSessionState, useConnect, appMetaData } from './lib/auth';
import { useAtom } from 'jotai';
import Client from '@walletconnect/sign-client';
import SendMany from './pages/SendMany';
import SendManyDetails from './pages/SendManyDetails';
import SendManyCyclePayout from './pages/SendManyCyclePayout';
import SendManyAdvocates from './pages/SendManyAdvocates';
import { Rate } from './components/Rate';
import { Network } from './components/Network';
import metaverse from './styles/metaverse.png';
import SendManyTransferDetails from './pages/SendManyTransferDetails';

/* global BigInt */
BigInt.prototype.toJSON = function() { return this.toString() }

const styles = {
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundImage: `url(${metaverse})`,
};

export default function App(props) {
  const { authOptions } = useConnect();
  const [userSession] = useAtom(userSessionState);
  const [, setUserData] = useAtom(userDataState);
  const [client, setClient] = useState(undefined);
  const [wcSession, setWcSession] = useState(undefined);

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

      setClient(c);
    };

    if (client === undefined) {
      f();
    }
  }, [client]);

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
          <Auth client={client} wcSession={wcSession} setWcSession={setWcSession} />
        </div>
      </nav>

      <Content
        userSession={userSession}
        client={client}
        wcSession={wcSession}
        setWcSession={setWcSession}
      />
    </Connect>
  );
}

function AppBody(props) {
  return <div>{props.children}</div>;
}
function Content({ userSession, client, wcSession, setWcSession }) {
  const stacksAuthenticated = userSession && userSession.isUserSignedIn();
  const wcAuthenticated = wcSession;
  const authenticated = stacksAuthenticated || wcAuthenticated;
  const decentralizedID = stacksAuthenticated && userSession.loadUserData().decentralizedID;
  console.log(wcSession);
  return (
    <>
      <Router>
        <AppBody path="/">
          <SendManyCyclePayout
            path="/cycle/:cycleId"
            decentralizedID={decentralizedID}
            userSession={userSession}
          />
          <SendManyAdvocates
            path="/advocates/:payoutId"
            decentralizedID={decentralizedID}
            userSession={userSession}
          />
          <SendManyDetails
            path="/txid/:txId"
            decentralizedID={decentralizedID}
            userSession={userSession}
          />
          <SendManyTransferDetails
            path="/txid/:txId/:eventIndex"
            decentralizedID={decentralizedID}
            userSession={userSession}
          />
          {!authenticated && (
            <Landing path="/" client={client} wcSession={wcSession} setWcSession={setWcSession} />
          )}
          {authenticated && (
            <>
              <SendMany
                path="/xbtc"
                userSession={userSession}
                wcSession={wcSession}
                client={client}
                asset="xbtc"
              />
              <SendManyCyclePayout
                path="/cycle/:cycleId"
                userSession={userSession}
                wcSession={wcSession}
              />
              <SendMany
                path="/"
                default
                userSession={userSession}
                wcSession={wcSession}
                client={client}
                asset="stx"
              />
            </>
          )}
        </AppBody>
      </Router>
    </>
  );
}
