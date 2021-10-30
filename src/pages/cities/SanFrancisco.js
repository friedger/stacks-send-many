import React, { useEffect } from 'react';
import { Redirect, Router } from '@reach/router';
import { useAtom } from 'jotai';
import { currentCity, currentCitySymbol } from '../../store/common';
import { SFO_CONTRACTS, SFO_TOKEN, SFO_CONFIG } from '../../store/sanfrancisco';
import CityDashboard from '../../components/common/CityDashboard';
import CityStats from '../../components/common/CityStats';
import CityActivation from '../../components/common/CityActivation';
import CityMining from '../../components/common/CityMining';
import CityStacking from '../../components/common/CityStacking';
import CityTools from '../../components/common/CityTools';
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
      <CityDashboard
        path="dashboard"
        contracts={SFO_CONTRACTS}
        token={SFO_TOKEN}
        config={SFO_CONFIG}
      />
      <CityStats path="stats" contracts={SFO_CONTRACTS} token={SFO_TOKEN} config={SFO_CONFIG} />
      <CityActivation
        path="activation"
        contracts={SFO_CONTRACTS}
        token={SFO_TOKEN}
        config={SFO_CONFIG}
      />
      <CityMining path="mining" contracts={SFO_CONTRACTS} token={SFO_TOKEN} config={SFO_CONFIG} />
      <CityStacking
        path="stacking"
        contracts={SFO_CONTRACTS}
        token={SFO_TOKEN}
        config={SFO_CONFIG}
      />
      <CityTools path="tools" contracts={SFO_CONTRACTS} token={SFO_TOKEN} config={SFO_CONFIG} />
      <NotFound default />
    </Router>
  );
}
