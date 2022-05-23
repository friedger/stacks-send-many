import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { fromMicro } from '../../lib/stacks';
import { CITY_INFO, currentCityAtom, currentRewardCycleAtom } from '../../store/cities';

export default function StackingStats({ stats }) {
  const [currentRewardCycle] = useAtom(currentRewardCycleAtom);
  const [currentCity] = useAtom(currentCityAtom);

  const symbol = useMemo(() => {
    return currentCity.loaded ? CITY_INFO[currentCity.data].symbol : undefined;
  }, [currentCity.loaded, currentCity.data]);

  return (
    <>
      <div
        className={`row text-nowrap text-center ${
          +stats.cycle === +currentRewardCycle.data ? 'text-success' : ''
        }`}
      >
        <div className="col">
          <span className="h5">{stats.cycle.toLocaleString()}</span>
          <br />
          <span className="text-muted">
            {+stats.cycle === +currentRewardCycle.data ? 'Current' : 'Cycle #'}
          </span>
        </div>
        <div className="col">
          <span className="h5">{stats.startBlock.toLocaleString()}</span>
          <br />
          <span className="text-muted">Start Block</span>
        </div>
        <div className="col">
          <span className="h5">{`${fromMicro(stats.amountToken).toLocaleString()} ${symbol}`}</span>
          <br />
          <span className="text-muted">Amount Stacked</span>
        </div>
        <div className="col">
          <span className="h5">{`${fromMicro(stats.amountUstx).toLocaleString()} STX`}</span>
          <br />
          <span className="text-muted">STX Rewards</span>
        </div>
        <div className="col">
          <span className="h5">{stats.progress}</span>
          <br />
          <span className="text-muted">Progress</span>
        </div>
      </div>
      <hr className="cc-divider" />
    </>
  );
}
