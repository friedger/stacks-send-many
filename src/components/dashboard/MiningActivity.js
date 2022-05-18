import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { getCoinbaseAmount, getMiningStatsAtBlock } from '../../lib/citycoins';
import { sleep } from '../../lib/common';
import { cityInfo, currentCity, miningStatsPerBlock } from '../../store/cities';
import { currentBlockHeight } from '../../store/stacks';
import CurrentStacksBlock from '../common/CurrentStacksBlock';
import LoadingSpinner from '../common/LoadingSpinner';
import MiningStats from './MiningStats';

export default function MiningActivity() {
  const [blockHeight] = useAtom(currentBlockHeight);
  const [city] = useAtom(currentCity);
  const [info] = useAtom(cityInfo);
  const [miningStats, setMiningStats] = useAtom(miningStatsPerBlock);

  useEffect(() => {
    if (blockHeight > 0 && city !== '') {
      for (let i = blockHeight - 2; i < blockHeight + 3; i++) {
        sleep(500);
        getMiningStatsAtBlock(info[city].currentVersion, city, i).then(data => {
          getCoinbaseAmount(info[city].currentVersion, city, i).then(amount => {
            data.blockHeight = i;
            data.rewardAmount = amount;
            data.city = city;
            setMiningStats(miningStats =>
              [...miningStats, data].sort((a, b) => (a.blockHeight < b.blockHeight ? 1 : -1))
            );
          });
        });
      }
    }
    return () => {
      console.log('unmounting mining activity');
    };
  }, [blockHeight, city, info]);

  return (
    <>
      <h3>{`${city !== '' ? info[city].symbol.toString() + ' ' : ''}Mining Activity`}</h3>
      <CurrentStacksBlock />
      {blockHeight && city !== '' && miningStats.length === 5 ? (
        miningStats.map(value => (
          <MiningStats
            key={`mining-${value.blockHeight}`}
            stats={value}
            current={blockHeight}
            symbol={info[city].symbol}
          />
        ))
      ) : (
        <LoadingSpinner text="Loading mining data" />
      )}
    </>
  );
}
