import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { getFirstStacksBlockInRewardCycle, getStackingStatsAtCycle } from '../../lib/citycoins';
import { sleep } from '../../lib/common';
import {
  cityInfo,
  currentCity,
  currentRewardCycle,
  rewardCycleLength,
  stackingStatsPerCycle,
} from '../../store/cities';
import { currentBlockHeight } from '../../store/stacks';
import CurrentRewardCycle from '../common/CurrentRewardCycle';
import LoadingSpinner from '../common/LoadingSpinner';
import StackingStats from './StackingStats';

export default function StackingActivity() {
  const [blockHeight] = useAtom(currentBlockHeight);
  const [rewardCycle] = useAtom(currentRewardCycle);
  const [city] = useAtom(currentCity);
  const [info] = useAtom(cityInfo);
  const [stackingStats, setStackingStats] = useAtom(stackingStatsPerCycle);

  useEffect(() => {
    const fetchStackingStats = async cycle => {
      const stats = await getStackingStatsAtCycle(info[city].currentVersion, city, cycle);
      stats.cycle = cycle;
      const startBlock = await getFirstStacksBlockInRewardCycle(
        info[city].currentVersion,
        city,
        cycle
      );
      stats.startBlock = startBlock;
      if (blockHeight > 0) {
        stats.progress =
          startBlock > blockHeight
            ? 'Future'
            : blockHeight - startBlock < rewardCycleLength
            ? (((blockHeight - startBlock) / rewardCycleLength) * 100).toFixed(2) + '%'
            : 'Complete';
      }
      setStackingStats(stackingStats =>
        [...stackingStats, stats].sort((a, b) => (a.cycle < b.cycle ? 1 : -1))
      );
    };
    if (rewardCycle > 0 && city !== '') {
      const start = +rewardCycle > 2 ? +rewardCycle - 2 : 0;
      const end = +rewardCycle > 2 ? +rewardCycle + 3 : 5;
      for (let i = start; i < end; i++) {
        sleep(500);
        fetchStackingStats(i);
      }
    }
    return () => {
      console.log('unmounting stacking activity');
    };
  }, [rewardCycle, city, info]);

  return (
    <>
      <h3>{`${city !== '' ? info[city].symbol.toString() + ' ' : ''}Stacking Activity`}</h3>
      <CurrentRewardCycle symbol={city !== '' && info[city].symbol} />
      {rewardCycle && city !== '' && stackingStats.length === 5 ? (
        stackingStats.map(value => (
          <StackingStats
            key={`stacking-${value.cycle}`}
            stats={value}
            current={rewardCycle}
            symbol={info[city].symbol}
          />
        ))
      ) : (
        <LoadingSpinner text="Loading stacking data" />
      )}
    </>
  );
}
