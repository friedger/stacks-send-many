import React from 'react';
import { CurrentBlockHeight } from './CurrentBlockHeight';
import { CurrentRewardCycle } from './CurrentRewardCycle';
import { CityCoinStackingReward } from './CityCoinStackingReward';

export function CityCoinStackingClaim({ ownerStxAddress }) {
  const rewardCycle = 1; //temporary fix

  return (
    <>
      <h3>Claim Stacking Rewards</h3>
      <CurrentBlockHeight />
      <CurrentRewardCycle />
      <div className="my-2">
        <p>Stacking rewards can be claimed after each cycle ends.</p>
      </div>
      <div className="row">
        <CityCoinStackingReward ownerStxAddress={ownerStxAddress} rewardCycle={rewardCycle} />
        <CityCoinStackingReward ownerStxAddress={ownerStxAddress} rewardCycle={rewardCycle + 1} />
      </div>
    </>
  );
}
