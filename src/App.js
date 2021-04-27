import React, { useEffect } from 'react';
import Landing from './pages/Landing';
import { Connect } from '@stacks/connect-react';
import { Link, Router } from '@reach/router';
import MyProfile from './pages/MyProfile';
import { NETWORK } from './lib/constants';
import Auth from './components/Auth';
import { userDataState, userSessionState, useConnect } from './lib/auth';
import { useAtom } from 'jotai';
import SendMany from './pages/SendMany';
import SendManyDetails from './pages/SendManyDetails';
import SendManyCyclePayout from './pages/SendManyCyclePayout';

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
      <nav className="navbar sticky-top navbar-dark bg-dark text-light">
        <a className="navbar-brand" href="/">
          <img src="/android-icon-96x96.png" alt="Logo" />
        </a>
        <Auth className="ml-auto" userSession={userSession} />
      </nav>

      <Content userSession={userSession} />
    </Connect>
  );
}

const NavLink = props => {
  return (
    <Link
      {...props}
      getProps={({ isCurrent }) => {
        // the object returned here is passed to the
        // anchor element's props
        if (isCurrent) {
          return {
            className: 'nav-item nav-link px-4 active',
          };
        } else {
          return { className: 'nav-item nav-link px-4' };
        }
      }}
    />
  );
};

function AppBody(props) {
  return (
    <div>
      <nav className="navbar navbar-expand-md nav-pills nav-justified mx-auto">
        <NavLink to="/">Send Many</NavLink>
        <NavLink to="/me">Profile</NavLink>
      </nav>
      {props.children}
      <div>{NETWORK.coreApiUrl}</div>
    </div>
  );
}
function Content({ userSession }) {
  const authenticated = userSession && userSession.isUserSignedIn();
  const decentralizedID =
    userSession && userSession.isUserSignedIn() && userSession.loadUserData().decentralizedID;
  return (
    <>
      {!authenticated && <Landing />}
      {decentralizedID && (
        <>
          <Router>
            <AppBody path="/">
              <SendMany path="/" decentralizedID={decentralizedID} userSession={userSession} />
              <SendManyDetails
                path="/txid/:txId"
                decentralizedID={decentralizedID}
                userSession={userSession}
              />
              <SendManyCyclePayout
                path="/cycle/:cycleId"
                decentralizedID={decentralizedID}
                userSession={userSession}
              />
              <MyProfile path="/me" decentralizedID={decentralizedID} userSession={userSession} />
            </AppBody>
          </Router>
        </>
      )}
    </>
  );
}
