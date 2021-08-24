import { useEffect, useState } from 'react';
import { getMiningStatsAtBlock } from '../lib/citycoin';

export function CityCoinMiningStats(blockHeight) {
  const [miningStats, setMiningStats] = useState();
  const [totalMiners, setTotalMiners] = useState();
  const [totalAmountStx, setTotalAmountStx] = useState();
  const [totalAmountToCity, setTotalAmountToCity] = useState();
  const [totalAmountToStackers, setTotalAmountToStackers] = useState();

  useEffect(() => {
    getMiningStatsAtBlock(blockHeight.value).then(result => {
      setMiningStats(result);
      setTotalMiners(result.value.value.minersCount.value);
      setTotalAmountStx(result.value.value.amount.value / 1000000);
      setTotalAmountToCity(result.value.value.amountToCity.value / 1000000);
      setTotalAmountToStackers(result.value.value.amountToStackers.value / 1000000);
    });
  }, [setMiningStats]);

  return (
    <>
      {miningStats ? (
        <>
          <div className="row">
            <div className="col-lg-6">Miners</div>
            <div className="col-lg-6">{totalMiners ? totalMiners : 'Please Refresh'}</div>
          </div>
          <div className="row">
            <div className="col-lg-6">Amount</div>
            <div className="col-lg-6">
              {totalAmountStx ? totalAmountStx.toFixed(2).toLocaleString() : 'Please Refresh'} STX
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">To City</div>
            <div className="col-lg-6">
              {totalAmountToCity ? totalAmountToCity.toFixed(2).toLocaleString() : 'Please Refresh'}{' '}
              STX
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">To Stackers</div>
            <div className="col-lg-6">
              {totalAmountToStackers
                ? totalAmountToStackers.toFixed(2).toLocaleString()
                : 'Please Refresh'}{' '}
              STX
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
