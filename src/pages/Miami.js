import React, { useEffect, useState } from 'react';
import { Link } from '@reach/router';
import { useAtom } from 'jotai';
import { getCityCoinTotalSupply } from '../lib/citycoin';
import { STACKS_API_URL } from '../lib/stacks';
import NavBar from '../components/common/NavBar';
import { currentBlockHeight, currentCity, currentCitySymbol } from '../store/common';
import { CITY_NAME, CITYCOIN_SYMBOL, CITY_WALLET, START_BLOCK } from '../store/miami';
import SelectCity from '../components/common/SelectCity';
import { getCurrentBlockHeight } from '../lib/stacks';

// need current block height
// need start block height
// need max * issuance schedule (get-coinbase-amount)
// need total supply
// need mia wallet balance
// need STX price

export default function Miami() {
  const [currentMiaBalance, setCurrentMiaBalance] = useState();
  const [currentMiaTotalSupply, setCurrentMiaTotalSupply] = useState();

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

  useEffect(() => {
    fetch(`${STACKS_API_URL}/extended/v1/address/${CITY_WALLET}/stx`)
      .then(result => {
        return result.json();
      })
      .then(data => {
        setCurrentMiaBalance(data.balance / 1000000);
      });
  }, []);

  useEffect(() => {
    getCityCoinTotalSupply().then(result => {
      setCurrentMiaTotalSupply(result);
    });
  }, []);

  // hardcoded for now, could use contract interactions
  const bonusPeriod = 10000;
  let maxSupply = 0;
  let blocksPast = blockHeight - START_BLOCK;
  if (blocksPast > bonusPeriod) {
    maxSupply = bonusPeriod * 250000 + (blocksPast - bonusPeriod) * 100000;
  } else {
    maxSupply = (blockHeight - START_BLOCK) * 250000;
  }

  return (
    <>
      <NavBar city={CITY_NAME} symbol={CITYCOIN_SYMBOL} />
      <div className="container pt-3">
        <h3>{CITY_NAME}</h3>
        <p>Current Block Height: {blockHeight > 0 ? blockHeight.toLocaleString() : 'Loading...'}</p>
        <div className="row">
          <div className="col-md-4">
            <div className="card p-2 m-2">
              <div className="card-body">
                <h5 className="card-title text-center">Max Supply</h5>
                <p className="text-center">
                  {maxSupply > 0
                    ? maxSupply.toLocaleString() + ` ${CITYCOIN_SYMBOL}`
                    : 'Loading...'}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-2 m-2">
              <div className="card-body">
                <h5 className="card-title text-center">Total Supply</h5>
                <p className="text-center">
                  {currentMiaTotalSupply
                    ? currentMiaTotalSupply.toLocaleString() + ` ${CITYCOIN_SYMBOL}`
                    : 'Loading...'}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-2 m-2">
              <div className="card-body">
                <h5 className="card-title text-center">MIA Wallet</h5>
                <p className="text-center">
                  {currentMiaBalance ? currentMiaBalance.toLocaleString() + ' STX' : 'Loading...'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div class="row align-items-center">
          <div class="col-md-3">
            <Link to="/" className="btn btn-lg btn-outline-primary">
              Back Home
            </Link>
          </div>
          <div class="col-md-9">
            <SelectCity />
          </div>
        </div>
      </div>
    </>
  );
}
