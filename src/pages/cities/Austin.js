import React, { useEffect } from 'react';
import { Redirect, Router } from '@reach/router';
import { useAtom } from 'jotai';
import { currentCity, currentCitySymbol } from '../../store/common';
import { ATX_CONTRACTS, ATX_TOKEN, ATX_CONFIG } from '../../store/austin';
import CityDashboard from '../../components/common/CityDashboard';
import CityStats from '../../components/common/CityStats';
import CityActivation from '../../components/common/CityActivation';
import CityMining from '../../components/common/CityMining';
import CityStacking from '../../components/common/CityStacking';
import CityTools from '../../components/common/CityTools';
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
      <CityDashboard
        path="dashboard"
        contracts={ATX_CONTRACTS}
        token={ATX_TOKEN}
        config={ATX_CONFIG}
      />
      <CityStats path="stats" contracts={ATX_CONTRACTS} token={ATX_TOKEN} config={ATX_CONFIG} />
      <CityActivation
        path="activation"
        contracts={ATX_CONTRACTS}
        token={ATX_TOKEN}
        config={ATX_CONFIG}
      />
      <CityMining path="mining" contracts={ATX_CONTRACTS} token={ATX_TOKEN} config={ATX_CONFIG} />
      <CityStacking
        path="stacking"
        contracts={ATX_CONTRACTS}
        token={ATX_TOKEN}
        config={ATX_CONFIG}
      />
      <CityTools path="tools" contracts={ATX_CONTRACTS} token={ATX_TOKEN} config={ATX_CONFIG} />
      <NotFound default />
    </Router>
  );
}
