import React, { useEffect } from 'react';
import Landing from './pages/Landing';
import { Connect } from '@stacks/connect-react';
import { Router } from '@reach/router';
import Auth from './components/Auth';
import { userDataState, userSessionState, useConnect } from './lib/auth';
import { useAtom } from 'jotai';
import SendMany from './pages/SendMany';
import SendManyDetails from './pages/SendManyDetails';
import SendManyCyclePayout from './pages/SendManyCyclePayout';
import { Rate } from './components/Rate';
import { Network } from './components/Network';
import metaverse from './styles/metaverse.png';

const styles = {
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundImage: `url(${metaverse})`,
};

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
      <nav className="navbar sticky-top navbar-dark text-light p-2" style={styles}>
        <a className="navbar-brand" href="/">
          <img src="/stacks.png" width="100" alt="Logo" />
        </a>
        <h1>Send Many</h1>
        <div>
          <Rate />
          <Network />
          <Auth className="ml-auto" userSession={userSession} />
        </div>
      </nav>

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
          <SendManyCyclePayout
            path="/cycle/:cycleId"
            decentralizedID={decentralizedID}
            userSession={userSession}
          />
          <SendManyDetails
            path="/txid/:txId"
            decentralizedID={decentralizedID}
            userSession={userSession}
          />
          {!authenticated && <Landing path="/" />}
          {decentralizedID && (
            <>
              <SendMany path="/" decentralizedID={decentralizedID} userSession={userSession} />

              <SendManyCyclePayout
                path="/cycle/:cycleId"
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
