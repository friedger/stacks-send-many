import React, { useRef, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { CITYCOIN_CONTRACT_NAME, CONTRACT_ADDRESS, NETWORK } from '../lib/constants';
import { TxStatus } from './TxStatus';

import {
  AnchorMode,
  bufferCVFromString,
  FungibleConditionCode,
  listCV,
  makeStandardSTXPostCondition,
  noneCV,
  PostConditionMode,
  someCV,
  uintCV,
} from '@stacks/transactions';
import BN from 'bn.js';

export function CityCoinMining({ ownerStxAddress }) {
  const amountRef = useRef();
  const mineManyRef = useRef();
  const memoRef = useRef();
  const [txId, setTxId] = useState();
  const [loading, setLoading] = useState();
  const [buttonLabel, setButtonLabel] = useState('Mine');
  const [numberOfBlocks, setNumberOfBlocks] = useState();
  const [blockAmounts, setBlockAmounts] = useState([]);
  const { doContractCall } = useConnect();

  // TODO: add onCancel state for loading that works ?
  // TODO: add logic for wallet not enabled (aka not installed)
  // TODO: consider state for when mining is active

  const mineAction = async () => {
    setLoading(true);
    if (numberOfBlocks == 1 && amountRef.current.value === '') {
      console.log('positive number required to mine');
      setLoading(false);
    } else {
      const mineMany = numberOfBlocks > 1;
      console.log(mineMany);
      try {
        const amountUstx = Math.floor(parseFloat(amountRef.current.value.trim()) * 1000000);
        const amountUstxCV = uintCV(amountUstx);
        const memo = memoRef.current.value.trim();
        const memoCV = memo ? someCV(bufferCVFromString(memo)) : noneCV();
        let mineManyArray = [];
        if (mineMany) {
          for (let i = 0; i < numberOfBlocks; i++) mineManyArray.push(blockAmounts[i].amount);
          mineManyArray = listCV(mineManyArray);
          console.log(mineManyArray);
        }

        await doContractCall({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CITYCOIN_CONTRACT_NAME,
          functionName: mineMany ? 'mine-many' : 'mine-tokens',
          functionArgs: mineMany ? [mineManyArray] : [amountUstxCV, memoCV],
          postConditionMode: PostConditionMode.Deny,
          postConditions: [
            makeStandardSTXPostCondition(
              ownerStxAddress,
              FungibleConditionCode.LessEqual,
              mineMany ? amountUstxCV.value.mul(new BN(numberOfBlocks)) : amountUstxCV.value
            ),
          ],
          anchorMode: AnchorMode.OnChainOnly,
          network: NETWORK,
          onCancel: () => {
            setLoading(false);
          },
          onFinish: result => {
            setLoading(false);
            setTxId(result.txId);
          },
        });
      } catch (e) {
        setLoading(false);
      }
    }
  };

  const updateValue = numberOfBlocks => {
    console.log(numberOfBlocks);
    if (numberOfBlocks > 1) {
      let totalAmount = 500;
      setButtonLabel(
        `Mine for ${numberOfBlocks} blocks (${totalAmount.toLocaleString(undefined, {
          style: 'decimal',
          maximumFractionDigits: 6,
        })} STX)`
      );

      for (let i = 1; i < (numberOfBlocks + 1) / 10; i++) {
        setBlockAmounts(currentBlock => [
          ...currentBlock,
          {
            num: i,
            amount: blockAmounts.amount,
          },
        ]);
      }
    } else {
      setButtonLabel('Mine');
    }
  };

  return (
    <>
      <h3>Mine CityCoins</h3>
      <p>
        Mining CityCoins is done by spending STX in a given Stacks block. A winner is selected
        randomly weighted by the miners' proportion of contributions of that block. Rewards can be
        withdrawn after a 100 block maturity window.
      </p>
      <form>
        <div className="input-group mb-3" hidden={numberOfBlocks != 1}>
          <input
            type="number"
            className="form-control"
            ref={amountRef}
            aria-label="Amount in STX"
            placeholder="Amount in STX"
            required
            minLength="1"
          />
          <div className="input-group-append">
            <span className="input-group-text">STX</span>
          </div>
        </div>
        <input
          ref={memoRef}
          className="form-control"
          type="text"
          placeholder="Memo (optional)"
          aria-label="Optional memo field"
          maxLength="34"
          hidden={numberOfBlocks != 1}
        />
        <br />
        <div>
          <input
            placeholder="Number of Blocks"
            ref={mineManyRef}
            onChange={event => {
              setNumberOfBlocks(event.target.value);
              setBlockAmounts([]);
              updateValue(event.target.value);
            }}
            value={numberOfBlocks}
            id="mineMany"
          />
        </div>
        {blockAmounts.map(b => {
          return (
            <div key={b.num}>
              <label style={{ marginRight: '15px' }}>{b.num}</label>
              <input
                onChange={e => {
                  const amount = e.target.value;
                  setBlockAmounts(currentBlock =>
                    currentBlock.map(x =>
                      x.num === b.num
                        ? {
                            ...x,
                            amount,
                          }
                        : x
                    )
                  );
                }}
                value={b.amount}
                placeholder="STX Amount"
              />
            </div>
          );
        })}
        <div>{JSON.stringify(blockAmounts, null, 2)}</div>
        <br />
        <button
          className="btn btn-block btn-primary"
          type="button"
          disabled={txId}
          onClick={mineAction}
        >
          <div
            role="status"
            className={`${
              loading ? '' : 'd-none'
            } spinner-border spinner-border-sm text-info align-text-top mr-2`}
          />
          {buttonLabel}
        </button>
      </form>
      {txId && <TxStatus txId={txId} />}
    </>
  );
}
