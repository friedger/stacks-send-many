import { fromMicro } from '../../lib/stacks';

export default function MiningStats({ stats, current, symbol }) {
  return (
    <>
      <div
        className={`row text-nowrap text-center ${
          stats.blockHeight === current ? 'text-success' : ''
        }`}
      >
        <div className="col">
          <span className="h5">{stats.blockHeight.toLocaleString()}</span>
          <br />
          <span className="text-muted">
            {stats.blockHeight === current ? 'Current' : 'Block #'}
          </span>
        </div>
        <div className="col">
          <span className="h5">{fromMicro(stats.amount).toLocaleString()} STX</span>
          <br />
          <span className="text-muted">Committed</span>
        </div>
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
      <hr className="cc-divider" />
    </>
  );
}
