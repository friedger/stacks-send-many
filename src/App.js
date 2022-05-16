import React, { useEffect } from 'react';
import { Connect } from '@stacks/connect-react';
import { Router } from '@reach/router';
import {
  userDataState,
  userSessionState,
  useConnect,
  userStxAddress,
  userAppStxAddress,
  userBnsName,
} from './lib/auth';
import { useAtom } from 'jotai';
import Landing from './pages/Landing';
import HeaderAuth from './components/layout/HeaderAuth';
import HeaderLogo from './components/layout/HeaderLogo';
import HeaderTitle from './components/layout/HeaderTitle';
import Footer from './components/layout/Footer';
import NotFound from './pages/NotFound';
import { useUpdateAtom } from 'jotai/utils';
import { getStacksAccount } from './lib/account';
import { addressToString } from '@stacks/transactions';
import { getBnsName, isMocknet, isTestnet } from './lib/stacks';

export default function App() {
  const { authOptions } = useConnect();

  return (
    <Connect authOptions={authOptions}>
      <div className="container mt-3">
        <div className="row align-items-center justify-content-between text-center mb-3">
          <div className="col-md text-md-start pb-3 pb-md-0">
            <p>Logo</p>
          </div>
          <div className="col-md-6 text-md-center pb-3 pb-md-0">
            <HeaderTitle />
          </div>
          <div className="col-md text-md-end text-nowrap pb-3 pb-md-0">
            <HeaderAuth />
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
  return <p>Hello World</p>;
}

// old idea: <CityLanding path="/:citySymbol" />
