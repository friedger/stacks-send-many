import { useConnect } from '@stacks/connect-react';
import {
  createAssetInfo,
  makeStandardFungiblePostCondition,
} from '@stacks/connect/node_modules/@stacks/transactions';
import { FungibleConditionCode, PostConditionMode, uintCV } from '@stacks/transactions';
import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { userSessionState } from '../../lib/auth';
import { getBalance, getRewardCycle } from '../../lib/citycoins';
import { useStxAddresses } from '../../lib/hooks';
import { NETWORK } from '../../lib/stacks';
import { cityBalancesAtom, currentBlockHeight, currentRewardCycle } from '../../store/common';
import CurrentStacksBlock from '../common/CurrentStacksBlock';
import FormResponse from '../common/FormResponse';
import LoadingSpinner from '../common/LoadingSpinner';
import StackingStats from '../dashboard/StackingStats';

export default function StackCityCoins(props) {
  const [blockHeight] = useAtom(currentBlockHeight);
  const [rewardCycle, setRewardCycle] = useAtom(currentRewardCycle);
  const amountRef = useRef();
  const cyclesRef = useRef();
  const [loading, setLoading] = useState();
  const [userSession] = useAtom(userSessionState);
  const { ownerStxAddress } = useStxAddresses(userSession);
  const [balance, setBalance] = useAtom(cityBalancesAtom);
  const { doContractCall } = useConnect();

  const [formMsg, setFormMsg] = useState({
    type: '',
    hidden: true,
    text: '',
    txId: '',
  });

  useEffect(() => {
    if (blockHeight > 0) {
      getRewardCycle(props.contracts.deployer, props.contracts.coreContract, blockHeight)
        .then(result => {
          setRewardCycle(result.value.value);
        })
        .catch(err => {
          setRewardCycle(0);
          console.log(err);
        });
    }
  }, [blockHeight, props.contracts.coreContract, props.contracts.deployer, setRewardCycle]);

  useEffect(() => {
    const updateBalance = async (balance, symbol) => {
      setBalance(prev => ({ ...prev, [symbol]: balance }));
    };
    ownerStxAddress &&
      getBalance(props.contracts.deployer, props.contracts.tokenContract, ownerStxAddress)
        .then(result => updateBalance(result.value.value, props.token.symbol.toUpperCase()))
        .catch(err => {
          console.log(err);
        });
  }, [
    ownerStxAddress,
    props.contracts.deployer,
    props.contracts.tokenContract,
    props.token.symbol,
    setBalance,
  ]);

  const stackingAction = async () => {
    setLoading(true);
    setFormMsg({
      type: '',
      hidden: true,
      text: '',
      txId: '',
    });
    const symbol = props.token.symbol;

    if (amountRef.current.value === '' || amountRef.current.value < 0) {
      setLoading(false);
      setFormMsg({
        type: 'danger',
        hidden: false,
        text: 'Please enter an amount to stack',
        txId: '',
      });
      return;
    }
    if (amountRef.current.value > balance[symbol]) {
      setLoading(false);
      setFormMsg({
        type: 'danger',
        hidden: false,
        text: `Cannot Stack more than your current balance: ${balance[
          symbol
        ].toLocaleString()} ${symbol}`,
        txId: '',
      });
      return;
    }
    if (cyclesRef.current.value === '' || cyclesRef.current.value < 0) {
      setLoading(false);
      setFormMsg({
        type: 'danger',
        hidden: false,
        text: 'Please enter the number of reward cycles',
        txId: '',
      });
      return;
    }
    if (cyclesRef.current.value > 32) {
      setLoading(false);
      setFormMsg({
        type: 'danger',
        hidden: false,
        text: 'Cannot select more than 32 cycles max',
        txId: '',
      });
      return;
    }

    const amountCV = uintCV(amountRef.current.value);
    const cyclesCV = uintCV(cyclesRef.current.value);

    await doContractCall({
      contractAddress: props.contracts.deployer,
      contractName: props.contracts.coreContract,
      functionName: 'stack-tokens',
      functionArgs: [amountCV, cyclesCV],
      network: NETWORK,
      postConditionMode: PostConditionMode.Deny,
      postConditions: [
        makeStandardFungiblePostCondition(
          ownerStxAddress,
          FungibleConditionCode.Equal,
          amountCV.value,
          createAssetInfo(props.contracts.deployer, props.contracts.tokenContract, props.token.name)
        ),
      ],
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
          text: 'Stacking transaction successfully sent',
          txId: result.txId,
        });
      },
    });
  };

  return (
    <div className="container-fluid p-6">
      <h3>
        Stacking {props.token.symbol}{' '}
        <a
          className="primary-link"
          target="_blank"
          rel="noreferrer"
          href="https://docs.citycoins.co/citycoins-core-protocol/stacking-citycoins"
        >
          <i className="bi bi-question-circle"></i>
        </a>
      </h3>
      <CurrentStacksBlock />
      <p>
        Current {props.token.symbol} Reward Cycle: {typeof rewardCycle === 'number' ? rewardCycle : <LoadingSpinner />}
      </p>
      <p>
        Stacking CityCoins locks up {props.token.symbol} in the contract for a selected number of
        reward cycles in return for a portion of the STX sent by miners. For more information on
        Stacking, please read the{' '}
        <a
          href="https://docs.citycoins.co/citycoins-core-protocol/stacking-citycoins#common-questions"
          target="_blank"
          rel="noreferrer"
        >
          common questions in the documentation
        </a>
        .
      </p>
      <div className="row g-4 flex-column flex-md-row align-items-center justify-content-center text-center text-nowrap">
        <div className="col">
          <div className="border rounded p-3">
            <p className="fs-5 text-center">Cycle Length</p>
            <div className="row text-center text-sm-start">
              <div className="col-sm-6">Current Cycle</div>
              <div className="col-sm-6">{typeof rewardCycle === 'number' ? rewardCycle : <LoadingSpinner />}</div>
            </div>
            <div className="row text-center text-sm-start">
              <div className="col-sm-6">Next Cycle</div>
              <div className="col-sm-6">{typeof rewardCycle === 'number' ? rewardCycle + 1 : <LoadingSpinner />}</div>
            </div>
            <div className="row text-center text-sm-start">
              <div className="col-sm-6">
                {props.config.rewardCycleLength.toLocaleString()} blocks
              </div>
              <div className="col-sm-6">~ 2 weeks</div>
            </div>
            <div className="row text-center text-sm-start">
              <div className="col-sm-6">Max 32 cycles</div>
              <div className="col-sm-6">~ 16 months</div>
            </div>
            <div className="row text-center text-sm-start">
              <div className="col text-center">
                <a href="https://stxtime.stxstats.xyz/" target="_blank" rel="noreferrer">
                  Block Time Estimator
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          {typeof rewardCycle === 'number' ? (
            <StackingStats
              contracts={props.contracts}
              token={props.token}
              config={props.config}
              cycle={rewardCycle}
            />
          ) : (
            <LoadingSpinner />
          )}
        </div>
        <div className="col">
          {typeof rewardCycle === 'number' ? (
            <StackingStats
              contracts={props.contracts}
              token={props.token}
              config={props.config}
              cycle={rewardCycle + 1}
            />
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
      <p className="fw-bold mt-3">Some quick notes:</p>
      <ul>
        <li>{props.token.symbol} are transferred to the contract while Stacking</li>
        <li>STX rewards can be claimed after each cycle ends</li>
        <li>Stacked {props.token.symbol} can be claimed after the selected period ends</li>
        <li>
          Stacking always occurs in the <span className="fst-italic">next reward cycle</span>
        </li>
        <li>Stackers must skip one cycle after the selected period ends</li>
      </ul>

      <h3 className="mt-3">
        Stack{typeof rewardCycle === 'number' ? ` in Cycle ${rewardCycle + 1}` : ''}
      </h3>
      <form>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            ref={amountRef}
            aria-label={`Amount in ${props.token.symbol}`}
            placeholder={`Amount in ${props.token.symbol}`}
            required
            minLength="1"
          />
          <div className="input-group-append">
            <span className="input-group-text">{props.token.symbol}</span>
          </div>
        </div>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            ref={cyclesRef}
            aria-label="Number of Reward Cycles"
            placeholder="Number of Reward Cycles"
            required
            max="32"
            minLength="1"
          />
        </div>
        <button className="btn btn-block btn-primary" type="button" onClick={stackingAction}>
          <div
            role="status"
            className={`${
              loading ? '' : 'd-none'
            } spinner-border spinner-border-sm text-info align-text-top me-1`}
          />
          Stack
        </button>
      </form>
      <FormResponse
        type={formMsg.type}
        text={formMsg.text}
        hidden={formMsg.hidden}
        txId={formMsg.txId}
      />
    </div>
  );
}
