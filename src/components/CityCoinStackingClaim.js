import React from 'react';
import { CurrentBlockHeight } from './CurrentBlockHeight';
import { CurrentRewardCycle } from './CurrentRewardCycle';
import { CityCoinStackingReward } from './CityCoinStackingReward';

export function CityCoinStackingClaim({ ownerStxAddress }) {
  const rewardCycle = 1; // temporary

  // should count backwards from current reward cycle atom
  // then loop and create needed number of CityCoinStackingReward components

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
        <CityCoinStackingReward ownerStxAddress={ownerStxAddress} rewardCycle={rewardCycle + 2} />
        <CityCoinStackingReward ownerStxAddress={ownerStxAddress} rewardCycle={rewardCycle + 3} />
      </div>
    </>
  );
}
