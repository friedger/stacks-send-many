import React, { useEffect } from 'react';
import { BLOCK_HEIGHT, refreshBlockHeight, refreshRewardCycle, REWARD_CYCLE } from '../lib/blocks';
import { CityCoinMiningStats } from './CityCoinMiningStats';
import { CityCoinStackingStats } from './CityCoinStackingStats';
import { CityCoinTxList } from './CityCoinTxList';
import { CurrentBlockHeight } from './CurrentBlockHeight';
import { CurrentRewardCycle } from './CurrentRewardCycle';
import { useAtom } from 'jotai';

export function CityCoinDashboard() {
  const [currentBlock, setCurrentBlock] = useAtom(BLOCK_HEIGHT);
  const [currentRewardCycle, setCurrentRewardCycle] = useAtom(REWARD_CYCLE);

  useEffect(() => {
    refreshBlockHeight(setCurrentBlock);
  }, [setCurrentBlock]);

  useEffect(() => {
    refreshRewardCycle(setCurrentRewardCycle, currentBlock.value);
  }, [setCurrentRewardCycle, currentBlock.value]);

  return (
    <>
      <h3>Mining Activity</h3>
      <CurrentBlockHeight />
      <div className="container">
        <div className="row">
          <div className="col-4">
            <div className="card p-2 m-2">
              <div className="card-body">
                <h5 className="card-title text-center">
                  Last Block ({currentBlock.initialized ? (currentBlock.value - 1).toLocaleString() : "loading..."})
                </h5>
                <CityCoinMiningStats value={-1} />
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card p-2 m-2">
              <div className="card-body">
                <h5 className="card-title text-center">
                  Current Block ({currentBlock.initialized ? currentBlock.value.toLocaleString() : "loading..."})
                </h5>
                <CityCoinMiningStats value={0} />
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card p-2 m-2">
              <div className="card-body">
                <h5 className="card-title text-center">
                  Next Block ({currentBlock.initialized ? (currentBlock.value + 1).toLocaleString() : "loading..."})
                </h5>
                <CityCoinMiningStats value={1} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <h3>Stacking Activity</h3>
      <CurrentRewardCycle />
      <div className="container">
        <div className="row">
          <div className="col-4">
            <div className="card p-2 m-2">
              <div className="card-body">
                <h5 className="card-title text-center">
                  Last Cycle ({currentRewardCycle.initialized ? currentRewardCycle.value - 1 : "loading..."})
                </h5>
                <CityCoinStackingStats value="-1" />
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card p-2 m-2">
              <div className="card-body">
                <h5 className="card-title text-center">
                  Current Cycle ({currentRewardCycle.initialized ? currentRewardCycle.value : "loading..."})
                </h5>
                <CityCoinStackingStats value="0" />
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card p-2 m-2">
              <div className="card-body">
                <h5 className="card-title text-center">
                  Next Cycle ({currentRewardCycle.initialized ? currentRewardCycle.value + 1 : "loading..."})
                </h5>
                <CityCoinStackingStats value="1" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <h3>Contract Transaction Log</h3>
      <CityCoinTxList />
    </>
  );
}
