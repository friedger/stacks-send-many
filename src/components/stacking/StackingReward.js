import { useConnect } from '@stacks/connect-react';
import {
  createAssetInfo,
  makeContractFungiblePostCondition,
  makeContractSTXPostCondition,
} from '@stacks/connect/node_modules/@stacks/transactions';
import { FungibleConditionCode, PostConditionMode, uintCV } from '@stacks/transactions';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { getStackerAtCycleOrDefault, getStackingReward } from '../../lib/citycoins';
import { NETWORK, ustxToStx } from '../../lib/stacks';
import { userId } from '../../store/common';
import FormResponse from '../common/FormResponse';
import LoadingSpinner from '../common/LoadingSpinner';

export default function StackingReward(props) {
  const [loading, setLoading] = useState();
  const [stackingRewards, setStackingRewards] = useState(0);
  const [rewards, setRewards] = useState(false);
  const [stackerStats, setStackerStats] = useState({});
  const [stats, setStats] = useState(false);
  const [id] = useAtom(userId);
  const { doContractCall } = useConnect();

  const [formMsg, setFormMsg] = useState({
    type: '',
    hidden: true,
    text: '',
    txId: '',
  });

  useEffect(() => {
    console.log(`id: ${JSON.stringify(id)}`);
    if (id > 0) {
      getStackingReward(props.contracts.deployer, props.contracts.coreContract, id, props.cycle)
        .then(result => {
          setStackingRewards(result.value);
          setRewards(true);
        })
        .catch(err => {
          setStackingRewards(0);
          console.log(err);
        });
      getStackerAtCycleOrDefault(
        props.contracts.deployer,
        props.contracts.coreContract,
        props.cycle,
        id
      )
        .then(result => {
          setStackerStats({
            amountStacked: result.value.amountStacked.value,
            toReturn: result.value.toReturn.value,
          });
          setStats(true);
        })
        .catch(err => {
          setStackerStats([]);
          console.log(err);
        });
    }
  }, [props.contracts.coreContract, props.contracts.deployer, props.cycle, id]);

  const claimAction = async () => {
    setLoading(true);
    setFormMsg({
      type: '',
      hidden: true,
      text: '',
      txId: '',
    });
    const targetCycleCV = uintCV(props.cycle);
    const amountUstxCV = uintCV(stackingRewards);
    const amountCityCoinCV = uintCV(stackerStats.toReturn);
    let postConditions = [];
    amountUstxCV.value > 0 &&
      postConditions.push(
        makeContractSTXPostCondition(
          props.contracts.deployer,
          props.contracts.coreContract,
          FungibleConditionCode.Equal,
          amountUstxCV.value
        )
      );
    amountCityCoinCV.value > 0 &&
      postConditions.push(
        makeContractFungiblePostCondition(
          props.contracts.deployer,
          props.contracts.coreContract,
          FungibleConditionCode.Equal,
          amountCityCoinCV.value,
          createAssetInfo(props.contracts.deployer, props.contracts.tokenContract, props.token.name)
        )
      );
    await doContractCall({
      contractAddress: props.contracts.deployer,
      contractName: props.contracts.coreContract,
      functionName: 'claim-stacking-reward',
      functionArgs: [targetCycleCV],
      postConditionMode: PostConditionMode.Deny,
      postConditions: postConditions,
      network: NETWORK,
      onCancel: () => {
        setLoading(false);
        setFormMsg({
          type: 'warning',
          hidden: false,
          text: 'Transaction was canceled, please try again.',
          txId: '',
        });
      },
      onFinish: result => {
        setLoading(false);
        setFormMsg({
          type: 'success',
          hidden: false,
          text: 'Stacking claim transaction successfully sent',
          txId: result.txId,
        });
      },
    });
  };

  return (
    <div className="border rounded p-3 text-nowrap">
      <p className="fs-5 text-center">Cycle #{props.cycle} Rewards</p>
      <div className="row text-center text-sm-start">
        <div className="col-sm-6">{props.token.symbol} Stacked</div>
        <div className="col-sm-6">
          {stats ? stackerStats.amountStacked.toLocaleString() : <LoadingSpinner />}
        </div>
      </div>
      <div className="row text-center text-sm-start">
        <div className="col-sm-6">STX Rewards</div>
        <div className="col-sm-6">
          {rewards ? ustxToStx(stackingRewards).toLocaleString() : <LoadingSpinner />}
        </div>
      </div>
      <div className="row text-center text-sm-start">
        <div className="col-sm-6">{props.token.symbol} to Claim</div>
        <div className="col-sm-6">
          {stats ? stackerStats.toReturn.toLocaleString() : <LoadingSpinner />}
        </div>
      </div>
      {stackingRewards > 0 || stackerStats.toReturn > 0 ? (
        <div className="text-center">
          <button className="btn btn-block btn-primary mt-3" type="button" onClick={claimAction}>
            <div
              role="status"
              className={`${
                loading ? '' : 'd-none'
              } spinner-border spinner-border-sm text-info align-text-top ms-1 me-2`}
            />
            Claim Rewards
          </button>
        </div>
      ) : (
        <p className="mt-3 text-center">Nothing to claim.</p>
      )}
      <FormResponse
        type={formMsg.type}
        text={formMsg.text}
        hidden={formMsg.hidden}
        txId={formMsg.txId}
      />
    </div>
  );
}
