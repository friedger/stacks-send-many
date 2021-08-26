import React, { useEffect, useState } from 'react';
import { Link } from '@reach/router';
import { useAtom } from 'jotai';
import { BLOCK_HEIGHT, refreshBlockHeight } from '../lib/blocks';
import { MIAMICOIN_MIA_WALLET, MIAMICOIN_START_BLOCK, STACKS_API_URL } from '../lib/constants';
import { getCityCoinTotalSupply, getStacksBalance } from '../lib/citycoin';

// need current block height
// need start block height
// need max * issuance schedule (get-coinbase-amount)
// need total supply
// need mia wallet balance
// need STX price

export function MiamiCoin() {
  const [currentBlock, setCurrentBlock] = useAtom(BLOCK_HEIGHT);
  const [currentMiaBalance, setCurrentMiaBalance] = useState();
  const [currentMiaTotalSupply, setCurrentMiaTotalSupply] = useState();

  useEffect(() => {
    refreshBlockHeight(setCurrentBlock);
  }, [setCurrentBlock]);

  useEffect(() => {
    fetch(`${STACKS_API_URL}/extended/v1/address/${MIAMICOIN_MIA_WALLET}/stx`)
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

  const maxSupply = (currentBlock.value - MIAMICOIN_START_BLOCK) * 250000;

  return (
    <div className="container pt-3">
      <h3>MiamiCoin</h3>
      <p>
        Current Block Height:{' '}
        {currentBlock.value > 0 ? currentBlock.value.toLocaleString() : 'Loading...'}
      </p>
      <div className="row">
        <div className="col-md-4">
          <div className="card p-2 m-2">
            <div className="card-body">
              <h5 className="card-title text-center">Max Supply</h5>
              <p className="text-center">
                {maxSupply > 0 ? maxSupply.toLocaleString() : 'Loading...'} MIA
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
                  ? currentMiaTotalSupply.toLocaleString() + ' MIA'
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

      <Link to="/" className="btn btn-outline-primary">
        Back Home
      </Link>
    </div>
  );
}
