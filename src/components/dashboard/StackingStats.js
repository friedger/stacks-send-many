import { fromMicro } from '../../lib/stacks';

export default function StackingStats({ stats, current, symbol }) {
  return (
    <>
      <div
        className={`row text-nowrap text-center ${stats.cycle === +current ? 'text-success' : ''}`}
      >
        <div className="col">
          <span className="h5">{stats.cycle.toLocaleString()}</span>
          <br />
          <span className="text-muted">{stats.cycle === +current ? 'Current' : 'Cycle #'}</span>
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

// Cycle #
// Start Block
// Amount Stacked
// STX Rewards
// Progress
