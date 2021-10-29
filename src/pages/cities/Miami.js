import React, { useEffect, useState } from 'react';
import { Link, Redirect, Router } from '@reach/router';
import { useAtom } from 'jotai';
import { getCityCoinTotalSupply } from '../../lib/citycoin';
import { STACKS_API_URL } from '../../lib/stacks';
import NavBar from '../../components/common/NavBar';
import { currentBlockHeight, currentCity, currentCitySymbol } from '../../store/common';
import { CITY_NAME, CITYCOIN_SYMBOL, CITY_WALLET, START_BLOCK } from '../../store/miami';
import SelectCity from '../../components/common/SelectCity';
import { getCurrentBlockHeight } from '../../lib/stacks';
import CityDashboard from '../../components/common/CityDashboard';
import CityStats from '../../components/common/CityStats';
import CityActivation from '../../components/common/CityActivation';
import CityMining from '../../components/common/CityMining';
import CityStacking from '../../components/common/CityStacking';
import CityTools from '../../components/common/CityTools';

// need current block height
// need start block height
// need max * issuance schedule (get-coinbase-amount)
// need total supply
// need mia wallet balance
// need STX price

export default function Miami() {
  const [, setCity] = useAtom(currentCity);
  const [, setSymbol] = useAtom(currentCitySymbol);

  useEffect(() => {
    setCity(CITY_NAME);
  }, [setCity]);

  useEffect(() => {
    setSymbol(CITYCOIN_SYMBOL);
  }, [setSymbol]);

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
