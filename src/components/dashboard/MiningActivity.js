import { useAtom } from 'jotai';
import { currentBlockHeight } from '../../store/common';
import MiningStats from './MiningStats';

export default function MiningActivity(props) {
  const [blockHeight] = useAtom(currentBlockHeight);
  return (
    <div className="container-fluid p-6">
      <h3>{props.token.symbol} Mining Activity</h3>
      <p>
        Current Stacks Block Height: {blockHeight ? blockHeight.toLocaleString() : 'Loading...'}
      </p>
      {blockHeight ? (
        <div className="row g-4 flex-column flex-lg-row row-cols-lg-3 align-items-center justify-content-center">
          <div className="col">
            <MiningStats
              contracts={props.contracts}
              token={props.token}
              config={props.config}
              blockHeight={blockHeight - 1}
            />
          </div>
          <div className="col">
            <MiningStats
              contracts={props.contracts}
              token={props.token}
              config={props.config}
              blockHeight={blockHeight}
            />
          </div>
          <div className="col">
            <MiningStats
              contracts={props.contracts}
              token={props.token}
              config={props.config}
              blockHeight={blockHeight + 1}
            />
          </div>
        </div>
      ) : (
        'Loading...'
      )}
    </div>
  );
}
