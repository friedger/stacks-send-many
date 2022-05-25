import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { fromMicro } from '../../lib/stacks';
import { CITY_INFO, currentCityAtom } from '../../store/cities';
import { currentStacksBlockAtom } from '../../store/stacks';

export default function MiningStats({ stats }) {
  const [currentStacksBlock] = useAtom(currentStacksBlockAtom);
  const [currentCity] = useAtom(currentCityAtom);

  const symbol = useMemo(() => {
    return currentCity.loaded ? CITY_INFO[currentCity.data].symbol : undefined;
  }, [currentCity.loaded, currentCity.data]);

  return (
    <>
      <hr className="cc-divider-alt" />
      <div
        className={`row text-nowrap text-center flex-column flex-md-row align-items-center justify-content-center ${
          stats.blockHeight === currentStacksBlock.data ? 'text-success' : ''
        }`}
      >
        <div className="col">
          <div className="row flex-column flex-sm-row">
            <div className="col">
              <span className="h5">{stats.blockHeight.toLocaleString()}</span>
              <br />
              <span className="text-muted">
                {stats.blockHeight === currentStacksBlock.data ? 'Current' : 'Block #'}
              </span>
            </div>
            <div className="col">
              <span className="h5">{fromMicro(stats.amount).toLocaleString()} STX</span>
              <br />
              <span className="text-muted">Committed</span>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="row flex-column flex-sm-row">
            <div className="col">
              <span className="h5">{stats.minersCount}</span>
              <br />
              <span className="text-muted">Miners</span>
            </div>
            <div className="col">
              <span className="h5">{`${fromMicro(
                stats.rewardAmount
              ).toLocaleString()} ${symbol}`}</span>
              <br />
              <span className="text-muted">Reward</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
