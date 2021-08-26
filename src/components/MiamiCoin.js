import React, { useEffect, useState } from 'react';
import { Link } from '@reach/router';
import { useAtom } from 'jotai';
import { BLOCK_HEIGHT, refreshBlockHeight } from '../lib/blocks';
import { MIAMICOIN_MIA_WALLET, MIAMICOIN_START_BLOCK } from '../lib/constants';
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
    getStacksBalance(MIAMICOIN_MIA_WALLET);
    console.log(`currentMiaBalance: ${currentMiaBalance}`);
  }, [setCurrentMiaBalance]);

  useEffect(() => {
    getCityCoinTotalSupply();
    console.log(`currentMiaTotalSupply: ${currentMiaTotalSupply}`);
  }, [setCurrentMiaTotalSupply]);

  const maxSupply = (currentBlock.value - MIAMICOIN_START_BLOCK) * 250000;

  return (
    <div className="container pt-3">
      <h3>MiamiCoin</h3>
      <p>
        Current Block Height:{' '}
        {currentBlock.value > 0 ? currentBlock.value.toLocaleString() : 'Loading...'}
      </p>
      <p>Max Supply: {maxSupply ? maxSupply.toLocaleString() : 'Loading...'} MIA</p>
      <p>Total Supply: {currentMiaTotalSupply}</p>
      <p>MIA Wallet: {currentMiaBalance}</p>
      <Link to="/" className="btn btn-outline-primary">
        Back Home
      </Link>
    </div>
  );
}
