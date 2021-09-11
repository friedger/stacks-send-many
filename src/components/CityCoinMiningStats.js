import { useEffect, useState } from 'react';
import { getMiningStatsAtBlock } from '../lib/citycoin';
import { useAtom } from 'jotai';
import { BLOCK_HEIGHT } from '../lib/blocks';

export function CityCoinMiningStats(offset) {
  const [miningStats, setMiningStats] = useState();
  const [totalMiners, setTotalMiners] = useState();
  const [totalAmountStx, setTotalAmountStx] = useState();
  const [totalAmountToCity, setTotalAmountToCity] = useState();
  const [totalAmountToStackers, setTotalAmountToStackers] = useState();
  const [blockHeight] = useAtom(BLOCK_HEIGHT);


  useEffect(() => {
    if(blockHeight.initialized) {
      getMiningStatsAtBlock(blockHeight.value + offset.value).then(result => {
        setMiningStats(result);
        setTotalMiners(result.value.value.minersCount.value);
        setTotalAmountStx(result.value.value.amount.value / 1000000);
        setTotalAmountToCity(result.value.value.amountToCity.value / 1000000);
        setTotalAmountToStackers(result.value.value.amountToStackers.value / 1000000);
      });
    }
  }, [setMiningStats, blockHeight.value]);

  return (
    <>
      {miningStats ? (
        <>
          <div className="row">
            <div className="col-lg-6">Miners</div>
            <div className="col-lg-6">{totalMiners ? totalMiners : 'Loading...'}</div>
          </div>
          <div className="row">
            <div className="col-lg-6">Amount</div>
            <div className="col-lg-6">
              {totalAmountStx
                ? parseFloat(totalAmountStx.toFixed(2)).toLocaleString() + ' STX'
                : 'Loading...'}
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">To City</div>
            <div className="col-lg-6">
              {totalAmountToCity
                ? parseFloat(totalAmountToCity.toFixed(2)).toLocaleString() + ' STX'
                : 'Loading...'}
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">To Stackers</div>
            <div className="col-lg-6">
              {totalAmountToStackers
                ? parseFloat(totalAmountToStackers.toFixed(2)).toLocaleString() + ' STX'
                : 'Loading...'}
            </div>
          </div>
        </>
      ) : (
        'Loading...'
      )}
    </>
  );
}
