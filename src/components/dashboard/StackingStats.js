import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import {
  getFirstStacksBlockInRewardCycle,
  getStackingStatsAtCycleOrDefault,
} from '../../lib/citycoins';
import { ustxToStx } from '../../lib/stacks';
import { currentBlockHeight } from '../../store/common';
import LoadingSpinner from '../common/LoadingSpinner';

export default function StackingStats(props) {
  const [blockHeight] = useAtom(currentBlockHeight);
  const [startBlock, setStartBlock] = useState(0);
  const [endBlock, setEndBlock] = useState(0);
  const [amountStacked, setAmountStacked] = useState(0);
  const [stxRewards, setStxRewards] = useState(0);
  const [percentComplete, setPercentComplete] = useState(0);

  useEffect(() => {
    const calculatePercent = async endBlock => {
      if (blockHeight > 0) {
        if (blockHeight > endBlock) {
          setPercentComplete(100);
        } else {
          if (endBlock - blockHeight < props.config.rewardCycleLength) {
            setPercentComplete(
              Math.round((1 - (endBlock - blockHeight) / props.config.rewardCycleLength) * 100)
            );
          } else {
            setPercentComplete(0);
          }
        }
      } else {
        setPercentComplete(0);
      }
    };

    getFirstStacksBlockInRewardCycle(
      props.contracts.deployer,
      props.contracts.coreContract,
      props.cycle
    )
      .then(result => {
        setStartBlock(result.value);
        const endBlock = result.value + props.config.rewardCycleLength - 1;
        setEndBlock(endBlock);
        calculatePercent(endBlock);
      })
      .catch(err => {
        setStartBlock(0);
        console.log(err);
      });
    getStackingStatsAtCycleOrDefault(
      props.contracts.deployer,
      props.contracts.coreContract,
      props.cycle
    )
      .then(result => {
        setAmountStacked(result.value.amountToken.value);
        setStxRewards(result.value.amountUstx.value);
      })
      .catch(err => {
        setAmountStacked(0);
        setStxRewards(0);
        console.log(err);
      });
  }, [
    blockHeight,
    props.config.rewardCycleLength,
    props.contracts.coreContract,
    props.contracts.deployer,
    props.cycle,
  ]);

  return (
    <div className="border rounded p-3 text-nowrap">
      <p className="fs-5 text-center">Cycle #{props.cycle}</p>
      <div className="row text-center text-sm-start">
        <div className="col-sm-6">Start Block</div>
        <div className="col-sm-6">
          {startBlock ? startBlock.toLocaleString() : <LoadingSpinner />}
        </div>
      </div>
      <div className="row text-center text-sm-start">
        <div className="col-sm-6">End Block</div>
        <div className="col-sm-6">{endBlock ? endBlock.toLocaleString() : <LoadingSpinner />}</div>
      </div>
      <div className="row text-center text-sm-start">
        <div className="col-sm-6">{props.token.symbol} Stacked</div>
        <div className="col-sm-6">
          {amountStacked ? (
            amountStacked.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
      <div className="row text-center text-sm-start">
        <div className="col-sm-6">STX Rewards</div>
        <div className="col-sm-6">
          {ustxToStx(stxRewards).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </div>
      </div>
      <div className="row text-center text-sm-start">
        <div className="col-sm-6">Progress</div>
        <div className="col-sm-6">{percentComplete + '%'}</div>
      </div>
    </div>
  );
}
