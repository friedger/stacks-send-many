import React, { useRef, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import {
  CONTRACT_DEPLOYER,
  CITYCOIN_CORE,
  CITYCOIN_TOKEN,
  CITYCOIN_SYMBOL,
  NETWORK,
  CITYCOIN_NAME,
} from '../lib/constants';
import { TxStatus } from './TxStatus';
import {
  createAssetInfo,
  FungibleConditionCode,
  makeStandardFungiblePostCondition,
  PostConditionMode,
  uintCV,
} from '@stacks/transactions';
import { getCityCoinBalance } from '../lib/citycoin';
import { CurrentBlockHeight } from './CurrentBlockHeight';

export function CityCoinStacking({ ownerStxAddress }) {
  const amountRefStacking = useRef();
  const lockPeriodRef = useRef();
  const [txId, setTxId] = useState();
  const [loading, setLoading] = useState();
  const { doContractCall } = useConnect();

  const stackingAction = async () => {
    setLoading(true);
    if (amountRefStacking.current.value === '' || lockPeriodRef.current.value === '') {
      console.log('positive numbers required to stack');
      setLoading(false);
    } else {
      const balance = await getCityCoinBalance(ownerStxAddress);
      const amountCityCoinCV = uintCV(amountRefStacking.current.value.trim());
      const lockPeriodCV = uintCV(lockPeriodRef.current.value.trim());
      if (lockPeriodCV.value.toNumber() > 32) {
        console.log('Too many cycles');
        setLoading(false);
      } else if (balance < amountCityCoinCV.value.toNumber()) {
        console.log('Not enough tokens');
        setLoading(false);
      } else {
        await doContractCall({
          contractAddress: CONTRACT_DEPLOYER,
          contractName: CITYCOIN_CORE,
          functionName: 'stack-tokens',
          functionArgs: [amountCityCoinCV, lockPeriodCV],
          network: NETWORK,
          postConditionMode: PostConditionMode.Deny,
          postConditions: [
            makeStandardFungiblePostCondition(
              ownerStxAddress,
              FungibleConditionCode.LessEqual,
              amountCityCoinCV.value,
              createAssetInfo(CONTRACT_DEPLOYER, CITYCOIN_TOKEN, CITYCOIN_NAME)
            ),
          ],
          onCancel: () => {
            setLoading(false);
          },
          onFinish: result => {
            setLoading(false);
            setTxId(result.txId);
          },
        });
      }
    }
  };

  return (
    <>
      <h3>Stack CityCoins</h3>
      <CurrentBlockHeight />
      <p>
        Stacking CityCoins locks up the set amount in the contract for a number of reward cycles.
        Once these reward cycles pass, CityCoin owners are eligible to withdraw their CityCoins in
        addition to STX commited by miners during that reward cycle, proportionate to the amount
        Stacked within that cycle.
      </p>
      <p>
        The first Stacking cycle begins at Block #26597, and to be eligible for rewards during that
        cycle, Stackers must lock their tokens prior to that block.
      </p>
      <p>
        You can submit for up to 32 cycles max, and will not be able to participate for one cycle
        when it ends (also called a "cooldown period").
      </p>
      <form>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            ref={amountRefStacking}
            aria-label="Amount in CityCoin"
            placeholder="Amount in CityCoin"
            required
            minLength="1"
          />
          <div className="input-group-append">
            <span className="input-group-text">{CITYCOIN_SYMBOL}</span>
          </div>
        </div>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            ref={lockPeriodRef}
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
            } spinner-border spinner-border-sm text-info align-text-top mr-2`}
          />
          Stack
        </button>
      </form>
      {txId && <TxStatus txId={txId} />}
    </>
  );
}
