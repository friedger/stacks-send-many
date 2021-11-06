import React, { useEffect } from 'react';
import { Redirect, Router } from '@reach/router';
import { useAtom } from 'jotai';
import { currentCity, currentCitySymbol } from '../../store/common';
import { ATX_CONTRACTS, ATX_TOKEN, ATX_CONFIG } from '../../store/austin';
import Dashboard from '../../pages/actions/Dashboard';
import Activation from '../../pages/actions/Activation';
import Mining from '../../pages/actions/Mining';
import Stacking from '../../pages/actions/Stacking';
import NotFound from '../NotFound';

export default function Austin() {
  const [, setCity] = useAtom(currentCity);
  const [, setSymbol] = useAtom(currentCitySymbol);

  useEffect(() => {
    setCity(ATX_CONFIG.cityName);
  }, [setCity]);

  useEffect(() => {
    setSymbol(ATX_TOKEN.symbol);
  }, [setSymbol]);

  return (
    <Router>
      <Redirect from="/" to="dashboard" />
      <Dashboard path="dashboard" contracts={ATX_CONTRACTS} token={ATX_TOKEN} config={ATX_CONFIG} />
      <Activation
        path="activation"
        contracts={ATX_CONTRACTS}
        token={ATX_TOKEN}
        config={ATX_CONFIG}
      />
      <Mining path="mining" contracts={ATX_CONTRACTS} token={ATX_TOKEN} config={ATX_CONFIG} />
      <Stacking path="stacking" contracts={ATX_CONTRACTS} token={ATX_TOKEN} config={ATX_CONFIG} />
      <NotFound default />
    </Router>
  );
}
