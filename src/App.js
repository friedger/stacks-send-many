import React, { useEffect } from 'react';
import Landing from './pages/Landing';
import { Connect } from '@stacks/connect-react';
import { Router } from '@reach/router';
import Auth from './components/Auth';
import { userDataState, userSessionState, useConnect } from './lib/auth';
import { useAtom } from 'jotai';
import CityCoin from './pages/CityCoin';
import { Rate } from './components/Rate';
import { Network } from './components/Network';

export default function App(props) {
  const { authOptions } = useConnect();
  const [userSession] = useAtom(userSessionState);
  const [, setUserData] = useAtom(userDataState);

  useEffect(() => {
    if (userSession?.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn();
    }
  }, [userSession, setUserData]);

  return (
    <Connect authOptions={authOptions}>
      <header className="d-flex flex-wrap justify-content-between align-items-center mx-3 py-3 mb-4 border-bottom">
        <div>
          <a
            href="/"
            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none"
          >
            <img src="/citycoin-icon-blue-reversed-75x75.png" width="75" alt="CityCoins CC Logo" />
          </a>
        </div>
        <div>
          <span className="h1">CityCoins</span>
        </div>
        <div className="btn-group btn-group-lg" role="group" aria-label="Basic outlined example">
          <button type="button" className="btn btn-outline-primary">
            Home
          </button>
          <a
            href="https://docs.citycoin.co"
            target="_blank"
            rel="noopener"
            className="btn btn-outline-primary"
          >
            Docs
          </a>
          <Auth />
        </div>
      </header>

      <Content userSession={userSession} />
    </Connect>
  );
}

function AppBody(props) {
  return <div>{props.children}</div>;
}
function Content({ userSession }) {
  const authenticated = userSession && userSession.isUserSignedIn();
  const decentralizedID =
    userSession && userSession.isUserSignedIn() && userSession.loadUserData().decentralizedID;
  return (
    <>
      <Router>
        <AppBody path="/">
          {!authenticated && <Landing path="/" />}
          {decentralizedID && (
            <>
              <CityCoin path="/" decentralizedID={decentralizedID} userSession={userSession} />
            </>
          )}
        </AppBody>
      </Router>
    </>
  );
}
