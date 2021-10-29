import React, { useEffect } from 'react';
import { Redirect, Router } from '@reach/router';
import { useAtom } from 'jotai';
import { getCurrentBlockHeight } from '../../lib/stacks';
import { currentBlockHeight, currentCity, currentCitySymbol } from '../../store/common';
import { CITY_NAME, CITYCOIN_SYMBOL } from '../../store/newyorkcity';
import CityDashboard from '../../components/common/CityDashboard';
import CityStats from '../../components/common/CityStats';
import CityActivation from '../../components/common/CityActivation';
import CityMining from '../../components/common/CityMining';
import CityStacking from '../../components/common/CityStacking';
import CityTools from '../../components/common/CityTools';

export default function NewYorkCity() {
  const [, setCity] = useAtom(currentCity);
  const [, setSymbol] = useAtom(currentCitySymbol);
  const [blockHeight, setBlockHeight] = useAtom(currentBlockHeight);

  useEffect(() => {
    setCity(CITY_NAME);
  }, [setCity]);

  useEffect(() => {
    setSymbol(CITYCOIN_SYMBOL);
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
      <CityDashboard path="dashboard" city={CITY_NAME} symbol={CITYCOIN_SYMBOL} />
      <CityStats path="stats" city={CITY_NAME} symbol={CITYCOIN_SYMBOL} />
      <CityActivation path="activation" city={CITY_NAME} symbol={CITYCOIN_SYMBOL} />
      <CityMining path="mining" city={CITY_NAME} symbol={CITYCOIN_SYMBOL} />
      <CityStacking path="stacking" city={CITY_NAME} symbol={CITYCOIN_SYMBOL} />
      <CityTools path="tools" city={CITY_NAME} symbol={CITYCOIN_SYMBOL} />
    </Router>
  );
}
