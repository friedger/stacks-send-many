import React, { useEffect } from 'react';
import { Connect } from '@stacks/connect-react';
import { Router } from '@reach/router';
import { userDataState, userSessionState, useConnect } from './lib/auth';
import { useAtom } from 'jotai';
import './styles/style.css';
import HeaderAuth from './components/common/HeaderAuth';
import HeaderLogo from './components/common/HeaderLogo';
import HeaderNav from './components/common/HeaderNav';
import HeaderTitle from './components/common/HeaderTitle';
import SelectCity from './components/common/SelectCity';
import Landing from './pages/Landing';
import MiamiCoin from './components/MiamiCoin';

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
      <div className="container">
        <div className="row align-items-center justify-content-between text-center mb-3">
          <div class="col-md text-md-start">
            <HeaderLogo />
          </div>
          <div class="col-md-6 text-md-center">
            <HeaderTitle />
          </div>
          <div class="col-md text-md-end text-nowrap">
            <HeaderAuth />
          </div>
        </div>
        <div className="row align-items-center">
          <div class="col-md text-md-start">
            <SelectCity />
          </div>
          <div class="col-md-6 text-md-center">
            <HeaderNav />
          </div>
          <div class="col-md text-md-end text-nowrap">
            <a
              href="https://docs.citycoins.co"
              target="_blank"
              rel="noreferrer"
              className="nav-link"
            >
              <i class="bi bi-info-circle"></i> Read the Docs
            </a>
          </div>
        </div>
        <hr />
        <div className="row align-items-center">
          <div class="col">
            <Content userSession={userSession} />
          </div>
        </div>
      </div>
    </Connect>
  );
}

function Content({ userSession }) {
  return (
    <>
      <Router>
        <Landing path="/" exact />
        <MiamiCoin path="/mia" />
      </Router>
    </>
  );
}
