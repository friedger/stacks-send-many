import { useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { getCoinbaseAmount, getMiningStatsAtBlock } from '../../lib/citycoins';
import { CITY_INFO, currentCityAtom, miningStatsPerCityAtom } from '../../store/cities';
import { currentStacksBlockAtom } from '../../store/stacks';
import CurrentStacksBlock from '../common/CurrentStacksBlock';
import LoadingSpinner from '../common/LoadingSpinner';
import MiningStats from './MiningStats';

export default function MiningActivity() {
  const [currentStacksBlock] = useAtom(currentStacksBlockAtom);
  const [currentCity] = useAtom(currentCityAtom);
  const [miningStatsPerCity, setMiningStatsPerCity] = useAtom(miningStatsPerCityAtom);

  const cityMiningStats = useMemo(() => {
    if (currentCity.loaded) {
      const key = currentCity.data;
      if (miningStatsPerCity[key]) {
        return miningStatsPerCity[key];
      }
    }
    return undefined;
  }, [currentCity.loaded, currentCity.data, miningStatsPerCity]);

  const updateMiningStats = useMemo(() => {
    if (!currentStacksBlock.loaded) return false;
    if (cityMiningStats.updating === true) return false;
    if (cityMiningStats.lastUpdated === currentStacksBlock.data) return false;
    return true;
  }, [
    cityMiningStats.lastUpdated,
    cityMiningStats.updating,
    currentStacksBlock.data,
    currentStacksBlock.loaded,
  ]);

  useEffect(() => {
    // async getter for the data per block
    const fetchMiningStats = async (block, distance) => {
      const stats = await getMiningStatsAtBlock(
        CITY_INFO[currentCity.data].currentVersion,
        currentCity.data,
        block
      );
      stats.blockHeight = block;
      const reward = await getCoinbaseAmount(
        CITY_INFO[currentCity.data].currentVersion,
        currentCity.data,
        block
      );
      stats.rewardAmount = reward;
      setMiningStatsPerCity(prev => {
        // copy of full object
        const newStats = { ...prev };
        // copy of city object
        const newCityStats = newStats[currentCity.data];
        newCityStats.data.push(stats);
        newCityStats.data.sort((a, b) => a.blockHeight - b.blockHeight);
        newCityStats.updating = distance === +newCityStats.data.length ? false : true;
        // rewrite city object in full object
        newStats[currentCity.data] = newCityStats;
        return newStats;
      });
    };
    if (updateMiningStats) {
      // check values and perform update if necessary
      const key = currentCity.data;
      const block = +currentStacksBlock.data;
      const start = block - 2;
      const end = block + 2;
      // clear old values
      setMiningStatsPerCity(prev => {
        const newStats = { ...prev };
        newStats[key] = { data: [], updating: true, lastUpdated: block };
        return newStats;
      });
      // fetch + set new values
      for (let i = start; i <= end; i++) {
        fetchMiningStats(i, end - start + 1);
      }
    }
  }, [currentCity.data, currentStacksBlock.data, setMiningStatsPerCity, updateMiningStats]);

  return (
    <div className="container-fluid p-6">
      <h3>{`${
        currentCity.loaded ? CITY_INFO[currentCity.data].symbol.toString() + ' ' : ''
      }Mining Activity`}</h3>
      <CurrentStacksBlock />
      {cityMiningStats.updating ? (
        <LoadingSpinner text={`Loading mining data`} />
      ) : (
        cityMiningStats.data.map(value => (
          <MiningStats key={`stats-${value.blockHeight}`} stats={value} />
        ))
      )}
    </div>
  );
}
