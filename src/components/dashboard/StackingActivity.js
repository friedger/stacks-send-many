import { useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { getFirstStacksBlockInRewardCycle, getStackingStatsAtCycle } from '../../lib/citycoins';
import {
  CITY_INFO,
  REWARD_CYCLE_LENGTH,
  currentCityAtom,
  currentRewardCycleAtom,
  stackingStatsPerCityAtom,
} from '../../store/cities';
import { currentStacksBlockAtom } from '../../store/stacks';
import CurrentRewardCycle from '../common/CurrentRewardCycle';
import LoadingSpinner from '../common/LoadingSpinner';
import StackingStats from './StackingStats';

export default function StackingActivity() {
  const [currentStacksBlock] = useAtom(currentStacksBlockAtom);
  const [currentRewardCycle] = useAtom(currentRewardCycleAtom);
  const [currentCity] = useAtom(currentCityAtom);
  const [stackingStatsPerCity, setStackingStatsPerCity] = useAtom(stackingStatsPerCityAtom);

  const cityStackingStats = useMemo(() => {
    if (currentCity.loaded) {
      const key = currentCity.data;
      if (stackingStatsPerCity[key]) {
        return stackingStatsPerCity[key];
      }
    }
    return undefined;
  }, [currentCity.loaded, currentCity.data, stackingStatsPerCity]);

  const updateStackingStats = useMemo(() => {
    if (!currentRewardCycle.loaded) return false;
    if (cityStackingStats.updating === true) return false;
    if (cityStackingStats.lastUpdated === currentStacksBlock.data) return false;
    return true;
  }, [
    cityStackingStats.lastUpdated,
    cityStackingStats.updating,
    currentStacksBlock.data,
    currentRewardCycle.loaded,
  ]);

  useEffect(() => {
    // async getter for the data per cycle
    const fetchStackingStats = async (cycle, distance) => {
      const stats = await getStackingStatsAtCycle(
        CITY_INFO[currentCity.data].currentVersion,
        currentCity.data,
        cycle
      );
      stats.cycle = +cycle;
      const startBlock = await getFirstStacksBlockInRewardCycle(
        CITY_INFO[currentCity.data].currentVersion,
        currentCity.data,
        cycle
      );
      stats.startBlock = +startBlock;
      const currentBlock = currentStacksBlock.data;
      stats.progress =
        startBlock > currentBlock
          ? 'Future'
          : currentBlock - startBlock < REWARD_CYCLE_LENGTH
          ? (((currentBlock - startBlock) / REWARD_CYCLE_LENGTH) * 100).toFixed(2) + '%'
          : 'Complete';
      setStackingStatsPerCity(prev => {
        // copy of full object
        const newStats = { ...prev };
        // copy of city object
        const newCityStats = newStats[currentCity.data];
        newCityStats.data.push(stats);
        newCityStats.data.sort((a, b) => a.cycle - b.cycle);
        newCityStats.updating = distance === +newCityStats.data.length ? false : true;
        // rewrite city object in full object
        newStats[currentCity.data] = newCityStats;
        return newStats;
      });
    };
    if (updateStackingStats) {
      // check values and perform update if necessary
      const key = currentCity.data;
      const block = +currentStacksBlock.data;
      const cycle = +currentRewardCycle.data;
      const start = cycle - 2;
      const end = cycle + 2;
      // clear old values
      setStackingStatsPerCity(prev => {
        const newStats = { ...prev };
        newStats[key] = { data: [], updating: true, lastUpdated: block };
        return newStats;
      });
      // fetch + set new values
      for (let i = start; i <= end; i++) {
        fetchStackingStats(i, end - start + 1);
      }
    }
  }, [
    currentCity.data,
    currentRewardCycle.data,
    currentStacksBlock.data,
    setStackingStatsPerCity,
    updateStackingStats,
  ]);

  return (
    <div className="container-fluid p-6">
      <h3>{`${
        currentCity.loaded ? CITY_INFO[currentCity.data].symbol.toString() + ' ' : ''
      }Stacking Activity`}</h3>
      <CurrentRewardCycle symbol={currentCity.loaded && CITY_INFO[currentCity.data].symbol} />
      {cityStackingStats.updating ? (
        <LoadingSpinner text={`Loading stacking data`} />
      ) : (
        cityStackingStats.data.map(value => (
          <StackingStats key={`stats-${value.cycle}`} stats={value} />
        ))
      )}
    </div>
  );
}
