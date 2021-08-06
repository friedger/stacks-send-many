import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { BLOCK_HEIGHT, refreshBlockHeight, refreshRewardCycle, REWARD_CYCLE } from '../lib/blocks';
import { REWARD_CYCLE_LENGTH } from '../lib/constants';

export function CurrentRewardCycle() {
  const [blockHeight, setBlockHeight] = useAtom(BLOCK_HEIGHT);
  const [rewardCycle, setRewardCycle] = useAtom(REWARD_CYCLE);
  const rewardCycleLength = REWARD_CYCLE_LENGTH;

  useEffect(() => {
    refreshBlockHeight(setBlockHeight);
  }, [setBlockHeight]);

  useEffect(() => {
    refreshRewardCycle(26600);
  }, [setRewardCycle]);

  if (!isNaN(rewardCycle.value)) {
    return <p>Current Reward Cycle: {rewardCycle.value}</p>;
  } else {
    return <p>Current Reward Cycle: Unknown</p>;
  }
}
