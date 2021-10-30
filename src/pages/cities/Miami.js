import React, { useEffect } from 'react';
import { Redirect, Router } from '@reach/router';
import { useAtom } from 'jotai';
import { currentCity, currentCitySymbol } from '../../store/common';
import { MIA_CONTRACTS, MIA_TOKEN, MIA_CONFIG } from '../../store/miami';
import Dashboard from '../../pages/actions/Dashboard';
import Stats from '../../pages/actions/Stats';
import Activation from '../../pages/actions/Activation';
import Mining from '../../pages/actions/Mining';
import Stacking from '../../pages/actions/Stacking';
import Tools from '../../pages/actions/Tools';
import NotFound from '../NotFound';

export default function Miami() {
  const [, setCity] = useAtom(currentCity);
  const [, setSymbol] = useAtom(currentCitySymbol);

  useEffect(() => {
    setCity(MIA_CONFIG.cityName);
  }, [setCity]);

  useEffect(() => {
    setSymbol(MIA_TOKEN.symbol);
  }, [setSymbol]);

  return (
    <Router>
      <Redirect from="/" to="dashboard" />
      <Dashboard path="dashboard" contracts={MIA_CONTRACTS} token={MIA_TOKEN} config={MIA_CONFIG} />
      <Stats path="stats" contracts={MIA_CONTRACTS} token={MIA_TOKEN} config={MIA_CONFIG} />
      <Activation
        path="activation"
        contracts={MIA_CONTRACTS}
        token={MIA_TOKEN}
        config={MIA_CONFIG}
      />
      <Mining path="mining" contracts={MIA_CONTRACTS} token={MIA_TOKEN} config={MIA_CONFIG} />
      <Stacking path="stacking" contracts={MIA_CONTRACTS} token={MIA_TOKEN} config={MIA_CONFIG} />
      <Tools path="tools" contracts={MIA_CONTRACTS} token={MIA_TOKEN} config={MIA_CONFIG} />
      <NotFound default />
    </Router>
  );
}
