import React, { useEffect } from 'react';
import { Redirect, Router } from '@reach/router';
import { useAtom } from 'jotai';
import { currentCity, currentCitySymbol } from '../../store/common';
import { NYC_CONTRACTS, NYC_TOKEN, NYC_CONFIG } from '../../store/newyorkcity';
import Dashboard from '../../pages/actions/Dashboard';
import Activation from '../../pages/actions/Activation';
import Mining from '../../pages/actions/Mining';
import Stacking from '../../pages/actions/Stacking';
import NotFound from '../NotFound';

export default function NewYorkCity() {
  const [, setCity] = useAtom(currentCity);
  const [, setSymbol] = useAtom(currentCitySymbol);

  useEffect(() => {
    setCity(NYC_CONFIG.cityName);
  }, [setCity]);

  useEffect(() => {
    setSymbol(NYC_TOKEN.symbol);
  }, [setSymbol]);

  return (
    <Router>
      <Redirect from="/" to="dashboard" />
      <Dashboard path="dashboard" contracts={NYC_CONTRACTS} token={NYC_TOKEN} config={NYC_CONFIG} />
      <Activation
        path="activation"
        contracts={NYC_CONTRACTS}
        token={NYC_TOKEN}
        config={NYC_CONFIG}
      />
      <Mining path="mining" contracts={NYC_CONTRACTS} token={NYC_TOKEN} config={NYC_CONFIG} />
      <Stacking path="stacking" contracts={NYC_CONTRACTS} token={NYC_TOKEN} config={NYC_CONFIG} />
      <NotFound default />
    </Router>
  );
}
