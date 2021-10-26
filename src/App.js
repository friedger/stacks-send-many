import React, { useEffect, useState } from 'react';
import { Connect } from '@stacks/connect-react';
import { Router, Link } from '@reach/router';
import Landing from './pages/Landing';
import CityCoinRegistration from './pages/CityCoinRegistration';
import CityCoinActions from './pages/CityCoinActions';
import Dashboard from './pages/Dashboard';
import Auth from './components/Auth';
import { ProfileSmall } from './components/ProfileSmall';
import { userDataState, userSessionState, useConnect } from './lib/auth';
import { getMiningActivationStatus } from './lib/citycoin';
import { useAtom } from 'jotai';
import { MiamiCoin } from './components/MiamiCoin';
import "./styles/style.css"

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
          <Link to="/mia" className="btn btn-outline-primary">
            MIA Info
          </Link>
          <Auth />
        </div>
      </header>
      <NavBar />

      <Content userSession={userSession} />
    </Connect>
  );
}

function AppBody(props) {
  return <div>{props.children}</div>;
}

function NavBar({ userSession }) {
  return (
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
          <button
            className="btn btn-lg btn-outline-primary mt-4 ms-3"
            type="button"
            onClick={null}
          >
            Connect Wallet
          </button>
        </div>
        <div class="container mx-auto py-3 mb-4">
          <div class="row">
            <div class="col-sm justify-content-left ">
              <select class="form-select" aria-label="Default select example">
                <option selected>Select a City</option>
                  <option value="3">Fort Lauderdale</option>
                  <option value="2">Jacksonville</option>
                  <option value="1">Miami</option>
                  <option value="2">Orlando</option>
                  <option value="2">Port St. Lucie</option>
                  <option value="2">St. Petersburg</option>
                  <option value="2">Tampa</option>
              </select>
            </div>
            <div class="col-sm justify-content-center flex-grow-1">
            <ul class="nav nav-pills">
              <li class="nav-item"><a href="#" class="nav-link active" aria-current="page">Dashboard</a></li>
              <li class="nav-item"><a href="#" class="nav-link">Stats</a></li>
              <li class="nav-item"><a href="#" class="nav-link">Mining</a></li>
              <li class="nav-item"><a href="#" class="nav-link">Stacking</a></li>
            </ul>
            </div>
            <div class="col-sm justify-content-right">
              Read the Docs
            </div>
          </div>
        </div>
      </header>
      
  )
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
        <AppBody exact path="/">
          {!authenticated && <Landing path="/" />}
          {!miningActivated && (
            <CityCoinRegistration
              path="/"
              decentralizedID={decentralizedID}
              userSession={userSession}
            />
          )}
          {decentralizedID && (
            <CityCoinActions path="/" decentralizedID={decentralizedID} userSession={userSession} />
          )}
        </AppBody>
        <MiamiCoin path="/mia" />
        <Dashboard path="/dashboard" />
      </Router>
    </>
  );
}
