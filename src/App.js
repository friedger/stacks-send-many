import React, { useEffect } from 'react';
import { Connect } from '@stacks/connect-react';
import { Router } from '@reach/router';
import { userDataState, userSessionState, useConnect } from './lib/auth';
import { useAtom } from 'jotai';
import Landing from './pages/Landing';
import Austin from './pages/cities/Austin';
import Miami from './pages/cities/Miami';
import NewYorkCity from './pages/cities/NewYorkCity';
import SanFrancisco from './pages/cities/SanFrancisco';
import HeaderAuth from './components/common/HeaderAuth';
import HeaderLogo from './components/common/HeaderLogo';
import HeaderTitle from './components/common/HeaderTitle';
import Footer from './components/common/Footer';
import NotFound from './pages/NotFound';

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
      <div className="container mt-3">
        <div className="row align-items-center justify-content-between text-center mb-3">
          <div className="col-md text-md-start pb-3 pb-md-0">
            <HeaderLogo />
          </div>
          <div className="col-md-6 text-md-center pb-3 pb-md-0">
            <HeaderTitle />
          </div>
          <div className="col-md text-md-end text-nowrap pb-3 pb-md-0">
            <HeaderAuth userSession={userSession} />
          </div>
        </div>
        <hr />
        <div className="row align-items-center">
          <div className="col">
            <Content />
          </div>
        </div>
      </div>
      <Footer />
    </Connect>
  );
}

function Content() {
  return (
    <>
      <Router>
        <Landing path="/" exact />
        <Austin path="/atx/*" />
        <Miami path="/mia/*" />
        <NewYorkCity path="/nyc/*" />
        <SanFrancisco path="/sfo/*" />
        <NotFound default />
      </Router>
    </>
  );
}

// old idea: <CityLanding path="/:citySymbol" />
