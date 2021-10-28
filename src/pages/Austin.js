import React, { useEffect } from 'react';
import { Link } from '@reach/router';
import { useAtom } from 'jotai';
import { BLOCK_HEIGHT, refreshBlockHeight } from '../lib/blocks';
import NavBar from '../components/common/NavBar';
import { currentBlockHeight, currentCity, currentCitySymbol } from '../store/common';
import { CITY_NAME, CITYCOIN_SYMBOL } from '../store/austin';
import SelectCity from '../components/common/SelectCity';
import { getCurrentBlockHeight } from '../lib/stacks';

export default function Austin() {
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
                <p className="text-center">TBD</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-2 m-2">
              <div className="card-body">
                <h5 className="card-title text-center">Total Supply</h5>
                <p className="text-center">TBD</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-2 m-2">
              <div className="card-body">
                <h5 className="card-title text-center">{CITYCOIN_SYMBOL} Wallet</h5>
                <p className="text-center">TBD</p>
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
