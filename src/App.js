import React, { useEffect, useState } from 'react';
import { Connect } from '@stacks/connect-react';
import { Router } from '@reach/router';
import Landing from './pages/Landing';
import CityCoinRegistration from './pages/CityCoinRegistration';
import CityCoinActions from './pages/CityCoinActions';
import Auth from './components/Auth';
import { ProfileSmall } from './components/ProfileSmall';
import { userDataState, userSessionState, useConnect } from './lib/auth';
import { getMiningActivationStatus } from './lib/citycoin';
import { useAtom } from 'jotai';

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
        <div className="btn-group btn-group-lg" role="group" aria-label="CityCoins navigation">
          <ProfileSmall userSession={userSession} />
          <a
            href="https://docs.citycoins.co"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-primary"
          >
            Read the Docs
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
  const [miningActivated, setMiningActivated] = useState();

  useEffect(() => {
    getMiningActivationStatus()
      .then(result => {
        setMiningActivated(result);
      })
      .catch(e => {
        setMiningActivated(false);
        console.log(e);
      });
  }, []);

  return (
    <>
      <Router>
        <AppBody path="/">
          {!authenticated && <Landing path="/" />}
          {!miningActivated && (
            <CityCoinRegistration
              path="/"
              decentralizedID={decentralizedID}
              userSession={userSession}
            />
          )}
          {decentralizedID && (
            <>
              <CityCoinActions
                path="/"
                decentralizedID={decentralizedID}
                userSession={userSession}
              />
            </>
          )}
        </AppBody>
      </Router>
    </>
  );
}
