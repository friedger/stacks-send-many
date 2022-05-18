import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { getFirstStacksBlockInRewardCycle, getStackingStatsAtCycle } from '../../lib/citycoins';
import { sleep } from '../../lib/common';
import {
  CITY_INFO,
  REWARD_CYCLE_LENGTH,
  currentCityAtom,
  currentRewardCycleAtom,
  stackingStatsAtom,
} from '../../store/cities';
import { currentStacksBlockAtom } from '../../store/stacks';
import CurrentRewardCycle from '../common/CurrentRewardCycle';
import LoadingSpinner from '../common/LoadingSpinner';
import StackingStats from './StackingStats';

export default function StackingActivity() {
  const [currentStacksBlock] = useAtom(currentStacksBlockAtom);
  const [currentRewardCycle] = useAtom(currentRewardCycleAtom);
  const [currentCity] = useAtom(currentCityAtom);
  const [stackingStats, setStackingStats] = useAtom(stackingStatsAtom);

  useEffect(() => {
    const fetchStackingStats = async cycle => {
      const stats = await getStackingStatsAtCycle(
        CITY_INFO[currentCity.data].currentVersion,
        currentCity.data,
        cycle
      );
      stats.cycle = cycle;
      const startBlock = await getFirstStacksBlockInRewardCycle(
        CITY_INFO[currentCity.data].currentVersion,
        currentCity.data,
        cycle
      );
      stats.startBlock = startBlock;
      const stacksBlock = +currentStacksBlock.data;
      stats.progress =
        startBlock > stacksBlock
          ? 'Future'
          : stacksBlock - startBlock < REWARD_CYCLE_LENGTH
          ? (((stacksBlock - startBlock) / REWARD_CYCLE_LENGTH) * 100).toFixed(2) + '%'
          : 'Complete';
      setStackingStats(stackingStats =>
        [...stackingStats, stats].sort((a, b) => (a.cycle < b.cycle ? 1 : -1))
      );
    };
    if (currentStacksBlock.loaded && currentRewardCycle.loaded && currentCity.loaded) {
      const cycle = +currentRewardCycle.data;
      const start = cycle > 2 ? cycle - 2 : 1;
      const end = cycle > 2 ? cycle + 3 : 5;
      for (let i = start; i < end; i++) {
        sleep(500);
        fetchStackingStats(i);
      }
    }
    return () => {
      console.log('unmounting stacking activity');
    };
  }, [
    currentCity.data,
    currentCity.loaded,
    currentRewardCycle.data,
    currentRewardCycle.loaded,
    currentStacksBlock.data,
    currentStacksBlock.loaded,
  ]);

  return (
    <>
      <h3>{`${
        currentCity.loaded ? CITY_INFO[currentCity.data].symbol.toString() + ' ' : ''
      }Stacking Activity`}</h3>
      <CurrentRewardCycle symbol={currentCity.loaded && CITY_INFO[currentCity.data].symbol} />
      {currentRewardCycle.loaded && currentCity.loaded && stackingStats.length === 5 ? (
        stackingStats.map(value => (
          <StackingStats
            key={`stacking-${value.cycle}`}
            stats={value}
            current={currentRewardCycle.data}
            symbol={CITY_INFO[currentCity.data].symbol}
          />
        ))
      ) : (
        <LoadingSpinner text={`Loading stacking data (${stackingStats.length} / 5)`} />
      )}
    </>
  );
}
