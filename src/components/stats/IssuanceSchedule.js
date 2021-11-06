import { Fragment, useEffect, useState } from 'react';
import { getCoinbaseThresholds } from '../../lib/citycoins';
import LoadingSpinner from '../common/LoadingSpinner';

export default function IssuanceSchedule(props) {
  const [thresholds, setThresholds] = useState([]);
  const blockRewards = [250000, 100000, 50000, 25000, 12500, 6250, 3125];
  const bonusPeriod = 10000;

  useEffect(() => {
    getCoinbaseThresholds(props.contracts.deployer, props.contracts.tokenContract).then(result => {
      const thresholdResult = Object.entries(result.value.value);
      var thresholdList = [];
      thresholdResult.map(threshold => {
        thresholdList.push(threshold[1].value);
        return true;
      });
      setThresholds(thresholdList);
    });
  }, [props.contracts.deployer, props.contracts.tokenContract]);

  return (
    <div className="col-lg-6">
      <div className="border rounded p-3 text-nowrap">
        <p className="fs-5 text-center">Issuance Schedule</p>
        <div className="row text-center text-sm-start">
          <div className="col-sm-4">Rewards</div>
          <div className="col-sm-4">Start Block</div>
          <div className="col-sm-4">End Block</div>
        </div>

        {thresholds.length === 5 ? (
          blockRewards.map((value, idx) => {
            return (
              <Fragment key={idx}>
                <hr className="d-sm-none" />
                <div className="row text-center text-sm-start">
                  <div className="col-sm-4">{`${value.toLocaleString()} ${
                    props.token.symbol
                  }`}</div>
                  <div className="col-sm-4">
                    {idx === 0
                      ? props.config.startBlock.toLocaleString()
                      : idx === 1
                      ? (props.config.startBlock + bonusPeriod).toLocaleString()
                      : thresholds[idx - 2].toLocaleString()}
                  </div>
                  <div className="col-sm-4">
                    {idx === 0
                      ? (props.config.startBlock + bonusPeriod).toLocaleString()
                      : idx > thresholds.length
                      ? 'ongoing'
                      : thresholds[idx - 1].toLocaleString()}
                  </div>
                </div>
              </Fragment>
            );
          })
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </div>
  );
}
