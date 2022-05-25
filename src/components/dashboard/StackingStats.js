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
      <hr className="cc-divider-alt" />
      <div
        className={`row text-nowrap text-center flex-column flex-md-row align-items-center justify-content-center ${
          +stats.cycle === +currentRewardCycle.data ? 'text-success' : ''
        }`}
      >
        <div className="col col-md-2">
          <div className="row flex-column flex-sm-row">
            <div className="col">
              <span className="h5">{stats.cycle.toLocaleString()}</span>
              <br />
              <span className="text-muted">
                {+stats.cycle === +currentRewardCycle.data ? 'Current' : 'Cycle #'}
              </span>
            </div>
          </div>
        </div>
        <div className="col col-md-5">
          <div className="row flex-column flex-sm-row">
            <div className="col">
              <span className="h5">{stats.startBlock.toLocaleString()}</span>
              <br />
              <span className="text-muted">Start Block</span>
            </div>
            <div className="col">
              <span className="h5">{stats.progress}</span>
              <br />
              <span className="text-muted">Progress</span>
            </div>
          </div>
        </div>
        <div className="col col-md-5">
          <div className="row flex-column flex-sm-row">
            <div className="col">
              <span className="h5">{fromMicro(stats.amountToken).toLocaleString()}</span>
              <br />
              <span className="text-muted">{symbol} Stacked</span>
            </div>
            <div className="col">
              <span className="h5">{fromMicro(stats.amountUstx).toLocaleString()}</span>
              <br />
              <span className="text-muted">STX Rewards</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
