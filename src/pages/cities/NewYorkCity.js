import React, { useEffect } from 'react';
import { Redirect, Router } from '@reach/router';
import { useAtom } from 'jotai';
import { getCurrentBlockHeight } from '../../lib/stacks';
import { currentBlockHeight, currentCity, currentCitySymbol } from '../../store/common';
import { NYC_CONTRACTS, NYC_TOKEN, NYC_CONFIG } from '../../store/newyorkcity';
import CityDashboard from '../../components/common/CityDashboard';
import CityStats from '../../components/common/CityStats';
import CityActivation from '../../components/common/CityActivation';
import CityMining from '../../components/common/CityMining';
import CityStacking from '../../components/common/CityStacking';
import CityTools from '../../components/common/CityTools';
import NotFound from '../NotFound';

export default function NewYorkCity() {
  const [, setCity] = useAtom(currentCity);
  const [, setSymbol] = useAtom(currentCitySymbol);
  const [blockHeight, setBlockHeight] = useAtom(currentBlockHeight);

  useEffect(() => {
    setCity(NYC_CONFIG.cityName);
  }, [setCity]);

  useEffect(() => {
    setSymbol(NYC_TOKEN.symbol);
  }, [setSymbol]);

  useEffect(() => {
    async function getCurrentBlock() {
      const currentBlock = await getCurrentBlockHeight();
      setBlockHeight(currentBlock);
    }
    getCurrentBlock();
  }, [setBlockHeight]);

  return (
    <Router>
      <Redirect from="/" to="dashboard" />
      <CityDashboard
        path="dashboard"
        contracts={NYC_CONTRACTS}
        token={NYC_TOKEN}
        config={NYC_CONFIG}
      />
      <CityStats path="stats" contracts={NYC_CONTRACTS} token={NYC_TOKEN} config={NYC_CONFIG} />
      <CityActivation
        path="activation"
        contracts={NYC_CONTRACTS}
        token={NYC_TOKEN}
        config={NYC_CONFIG}
      />
      <CityMining path="mining" contracts={NYC_CONTRACTS} token={NYC_TOKEN} config={NYC_CONFIG} />
      <CityStacking
        path="stacking"
        contracts={NYC_CONTRACTS}
        token={NYC_TOKEN}
        config={NYC_CONFIG}
      />
      <CityTools path="tools" contracts={NYC_CONTRACTS} token={NYC_TOKEN} config={NYC_CONFIG} />
      <NotFound default />
    </Router>
  );
}
