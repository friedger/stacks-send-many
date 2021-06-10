import { ClarityType } from '@stacks/transactions';
import { useEffect, useState } from 'react';
import { getPoxInfo } from '../lib/citycoin';

export function PoxInfo() {
  const [poxInfo, setPoxInfo] = useState();
  useEffect(() => {
    getPoxInfo().then(info => setPoxInfo(info));
  }, []);
  return (
    <>
      {poxInfo && (
        <>
          {poxInfo.type === ClarityType.ResponseErr ? (
            <>City Coin not yet activated.</>
          ) : (
            <div className="container">
              <div className="row">
                <div className="col-6">Total Supply</div>
                <div className="col-6 text-right">
                  {poxInfo.value.data['total-supply'].value.toNumber()}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-6">Current Liquid Supply</div>
                <div className="col-6 text-right">
                  {poxInfo.value.data['cur-liquid-supply'].value.toNumber()}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-6">Current Locked Supply</div>
                <div className="col-6 text-right">
                  {poxInfo.value.data['cur-locked-supply'].value.toNumber()}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-6">Total STX locked</div>
                <div className="col-6 text-right">
                  {poxInfo.value.data['total-ustx-locked'].value.toNumber() / 1000000}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-6">Current STX committed</div>
                <div className="col-6 text-right">
                  {poxInfo.value.data['cur-ustx-committed'].value.toNumber() / 1000000}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-6">Reward Cycle Id</div>
                <div className="col-6 text-right">
                  {poxInfo.value.data['reward-cycle-id'].value.toNumber()}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-6">First Block Height</div>
                <div className="col-6 text-right">
                  {poxInfo.value.data['first-block-height'].value.toNumber()}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-6">Reward Cycle Length</div>
                <div className="col-6 text-right">
                  {poxInfo.value.data['reward-cycle-length'].value.toNumber()}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
