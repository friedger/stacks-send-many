import { useEffect, useState } from 'react';
import { getMiningStatsAtBlock } from '../lib/citycoin';

export function CityCoinMiningStats(blockHeight) {
  const [miningStats, setMiningStats] = useState();

  useEffect(() => {
    getMiningStatsAtBlock(blockHeight.value).then(result => {
      setMiningStats(result);
    });
  }, []);

  return (
    <>
      {miningStats ? (
        <>
          <h3>Mining Stats (Block {blockHeight.value})</h3>
          <div className="container mb-3">
            <div className="row">
              <div className="col-6">
                <div className="row">
                  <div className="col-6">Amount</div>
                  <div className="col-6">Data</div>
                </div>
                <div className="row">
                  <div className="col-6">Total Miners</div>
                  <div className="col-6">Data</div>
                </div>
              </div>
              <div className="col-6">
                <div className="row">
                  <div className="col-6">Amount to City</div>
                  <div className="col-6">Data</div>
                </div>
                <div className="row">
                  <div className="col-6">Amount to Stackers</div>
                  <div className="col-6">Data</div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
