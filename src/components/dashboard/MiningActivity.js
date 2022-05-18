import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { getCoinbaseAmount, getMiningStatsAtBlock } from '../../lib/citycoins';
import { sleep } from '../../lib/common';
import { CITY_INFO, currentCityAtom, miningStatsAtom } from '../../store/cities';
import { currentStacksBlockAtom } from '../../store/stacks';
import CurrentStacksBlock from '../common/CurrentStacksBlock';
import LoadingSpinner from '../common/LoadingSpinner';
import MiningStats from './MiningStats';

export default function MiningActivity() {
  const [currentStacksBlock] = useAtom(currentStacksBlockAtom);
  const [currentCity] = useAtom(currentCityAtom);
  const [miningStats, setMiningStats] = useAtom(miningStatsAtom);

  useEffect(() => {
    const fetchMiningStats = async block => {
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
      setMiningStats(miningStats =>
        [...miningStats, stats].sort((a, b) => (a.blockHeight < b.blockHeight ? 1 : -1))
      );
    };
    if (currentStacksBlock.loaded && currentCity.loaded) {
      const stacksBlock = +currentStacksBlock.data;
      for (let i = stacksBlock - 2; i < stacksBlock + 3; i++) {
        sleep(500);
        fetchMiningStats(i);
      }
    }
    return () => {
      console.log('unmounting mining activity');
    };
  }, [currentStacksBlock.loaded, currentStacksBlock.data, currentCity.loaded, currentCity.data]);

  return (
    <>
      <h3>{`${
        currentCity.loaded ? CITY_INFO[currentCity.data].symbol.toString() + ' ' : ''
      }Mining Activity`}</h3>
      <CurrentStacksBlock />
      {currentStacksBlock.loaded && currentCity.loaded && miningStats.length === 5 ? (
        miningStats.map(value => (
          <MiningStats
            key={`mining-${value.blockHeight}`}
            stats={value}
            current={currentStacksBlock.data}
            symbol={CITY_INFO[currentCity.data].symbol}
          />
        ))
      ) : (
        <LoadingSpinner text={`Loading mining data (${miningStats.length} / 5)`} />
      )}
    </>
  );
}
