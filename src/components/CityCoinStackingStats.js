import { useEffect, useState } from 'react';
import { getFirstStacksBlockInRewardCycle, getStackingStatsAtCycle } from '../lib/citycoin';
import { REWARD_CYCLE_LENGTH } from '../lib/constants';

export function CityCoinStackingStats(rewardCycle) {
  const [stackingStats, setStackingStats] = useState();
  const [amountStx, setAmountStx] = useState();
  const [amountToken, setAmountToken] = useState();
  const [stackingBlock, setStackingBlock] = useState();

  useEffect(() => {
    getStackingStatsAtCycle(rewardCycle.value).then(result => {
      console.log(result);
      setStackingStats(result);
      setAmountStx(result.value.amountUstx.value / 1000000);
      setAmountToken(result.value.amountToken.value);
    });
  }, [setStackingStats]);

  useEffect(() => {
    getFirstStacksBlockInRewardCycle(rewardCycle.value).then(result => {
      console.log(`rewardCycle: ${rewardCycle.value}\nresult: ${result}`);
      setStackingBlock(result);
    });
  }, [setStackingBlock]);

  return (
    <>
      {stackingStats ? (
        <>
          <div className="row">
            <div className="col-lg-6">Start Block</div>
            <div className="col-lg-6">
              {stackingBlock ? stackingBlock.toLocaleString() : 'Loading...'}
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">End Block</div>
            <div className="col-lg-6">
              {stackingBlock
                ? (stackingBlock + REWARD_CYCLE_LENGTH).toLocaleString()
                : 'Loading...'}
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">Amount Stacked</div>
            <div className="col-lg-6">
              {amountToken ? amountToken.toLocaleString() + ' MIA' : 'Loading...'}
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">STX Rewards</div>
            <div className="col-lg-6">
              {amountStx ? parseFloat(amountStx.toFixed(2)).toLocaleString() + ' STX' : 0 + ' STX'}
            </div>
          </div>
        </>
      ) : (
        'Loading...'
      )}
    </>
  );
}
