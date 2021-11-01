import React, { useEffect } from 'react';
import { Redirect, Router } from '@reach/router';
import { useAtom } from 'jotai';
import { currentCity, currentCitySymbol } from '../../store/common';
import { SFO_CONTRACTS, SFO_TOKEN, SFO_CONFIG } from '../../store/sanfrancisco';
import Dashboard from '../../pages/actions/Dashboard';
import Activation from '../../pages/actions/Activation';
import Mining from '../../pages/actions/Mining';
import Stacking from '../../pages/actions/Stacking';
import NotFound from '../NotFound';

export default function SanFrancisco() {
  const [, setCity] = useAtom(currentCity);
  const [, setSymbol] = useAtom(currentCitySymbol);

  useEffect(() => {
    setCity(SFO_CONFIG.cityName);
  }, [setCity]);

  useEffect(() => {
    setSymbol(SFO_TOKEN.symbol);
  }, [setSymbol]);

  return (
    <Router>
      <Redirect from="/" to="dashboard" />
      <Dashboard path="dashboard" contracts={SFO_CONTRACTS} token={SFO_TOKEN} config={SFO_CONFIG} />
      <Activation
        path="activation"
        contracts={SFO_CONTRACTS}
        token={SFO_TOKEN}
        config={SFO_CONFIG}
      />
      <Mining path="mining" contracts={SFO_CONTRACTS} token={SFO_TOKEN} config={SFO_CONFIG} />
      <Stacking path="stacking" contracts={SFO_CONTRACTS} token={SFO_TOKEN} config={SFO_CONFIG} />
      <NotFound default />
    </Router>
  );
}
