import React, { useEffect } from 'react';
import { Link } from '@reach/router';
import { useAtom } from 'jotai';
import { BLOCK_HEIGHT, refreshBlockHeight } from '../lib/blocks';
import NavBar from '../components/common/NavBar';
import { currentCity, currentCitySymbol } from '../store/common';

export default function SanFrancisco() {
  const [currentBlock, setCurrentBlock] = useAtom(BLOCK_HEIGHT);

  const [city, setCity] = useAtom(currentCity);
  const [symbol, setSymbol] = useAtom(currentCitySymbol);

  useEffect(() => {
    refreshBlockHeight(setCurrentBlock);
  }, [setCurrentBlock]);

  useEffect(() => {
    setCity('San Francisco');
  }, [setCity]);

  useEffect(() => {
    setSymbol('SFO');
  }, [setSymbol]);

  return (
    <>
      <NavBar city={city} symbol={symbol} />
      <div className="container pt-3">
        <h3>{city}</h3>
        <p>
          Current Block Height:{' '}
          {currentBlock.value > 0 ? currentBlock.value.toLocaleString() : 'Loading...'}
        </p>
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
                <h5 className="card-title text-center">SFO Wallet</h5>
                <p className="text-center">TBD</p>
              </div>
            </div>
          </div>
        </div>

        <Link to="/" className="btn btn-outline-primary">
          Back Home
        </Link>
      </div>
    </>
  );
}
