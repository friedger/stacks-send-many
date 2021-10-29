import React, { useEffect } from 'react';
import { Redirect, Router } from '@reach/router';
import { useAtom } from 'jotai';
import { currentCity, currentCitySymbol } from '../../store/common';
import { MIA_CONTRACTS, MIA_TOKEN, MIA_CONFIG } from '../../store/miami';
import CityDashboard from '../../components/common/CityDashboard';
import CityStats from '../../components/common/CityStats';
import CityActivation from '../../components/common/CityActivation';
import CityMining from '../../components/common/CityMining';
import CityStacking from '../../components/common/CityStacking';
import CityTools from '../../components/common/CityTools';
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
      <CityDashboard
        path="dashboard"
        contracts={MIA_CONTRACTS}
        token={MIA_TOKEN}
        config={MIA_CONFIG}
      />
      <CityStats path="stats" contracts={MIA_CONTRACTS} token={MIA_TOKEN} config={MIA_CONFIG} />
      <CityActivation
        path="activation"
        contracts={MIA_CONTRACTS}
        token={MIA_TOKEN}
        config={MIA_CONFIG}
      />
      <CityMining path="mining" contracts={MIA_CONTRACTS} token={MIA_TOKEN} config={MIA_CONFIG} />
      <CityStacking
        path="stacking"
        contracts={MIA_CONTRACTS}
        token={MIA_TOKEN}
        config={MIA_CONFIG}
      />
      <CityTools path="tools" contracts={MIA_CONTRACTS} token={MIA_TOKEN} config={MIA_CONFIG} />
      <NotFound default />
    </Router>
  );
}
