import React, { Fragment, useEffect, useState } from 'react';
import converter from 'number-to-words';
import { connectWebSocketClient } from '@stacks/blockchain-api-client';
import { cvToJSON, hexToCV } from '@stacks/transactions';
import _groupBy from 'lodash.groupby';
import {
  accountsApi,
  CITYCOIN_CORE,
  CONTRACT_DEPLOYER,
  STACKS_API_WS_URL,
  transactionsApi,
} from '../lib/constants';
import { Address } from './Address';
import LoadingSpinner from './common/LoadingSpinner';

export function CityCoinTxList() {
  const [txs, setTxs] = useState();

  const updateTxs = async () => {
    try {
      const result = await accountsApi.getAccountTransactions({
        principal: `${CONTRACT_DEPLOYER}.${CITYCOIN_CORE}`,
      });
      setTxs(
        _groupBy(
          result.results.filter(tx => tx.tx_status === 'success' && tx.tx_type === 'contract_call'),
          'block_height'
        )
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const subscribe = async () => {
      updateTxs();
      try {
        const client = await connectWebSocketClient(STACKS_API_WS_URL);
        await client.subscribeAddressTransactions(
          `${CONTRACT_DEPLOYER}.${CITYCOIN_CORE}`,
          async event => {
            if (event.tx_status === 'pending') {
              const mempooltx = await transactionsApi.getMempoolTransactionList();
              return;
            } else if (event.tx_status === 'success') {
              const tx = await transactionsApi.getTransactionById({ txId: event.tx_id });
              await updateTxs();
            }
          }
        );
      } catch (e) {
        console.log(e);
      }
    };

    subscribe();
  }, []);

  if (txs) {
    const blockHeights = txs ? Object.keys(txs).sort().reverse() : undefined;
    return (
      <>
        <div className="accordion accordion-flush" id="accordionActivityLog">
          {blockHeights.map((blockHeight, key) => (
            <Fragment key={key}>
              <div className="accordion-item">
                <h2
                  className="accordion-header"
                  id={`accordionActivityLog-heading-${converter.toWords(key + 1)}`}
                >
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#accordionActivityLog-activity-${converter.toWords(key + 1)}`}
                    aria-expanded="false"
                    aria-controls={`accordionActivityLog-activity-${converter.toWords(key + 1)}`}
                  >
                    Stacks Block #{blockHeight} (
                    <Timestamp tx={txs[blockHeight][0]} />)
                  </button>
                </h2>

                <div
                  id={`accordionActivityLog-activity-${converter.toWords(key + 1)}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`accordionActivityLog-heading-${converter.toWords(key + 1)}`}
                  data-bs-parent="#accordionActivityLog"
                >
                  <div className="accordion-body">
                    {txs[blockHeight].map((tx, txKey) => {
                      return (
                        <div className="card p-2 m-2" key={txKey}>
                          <div className="row pl-4">{transactionByType(tx, blockHeight)}</div>
                          <div className="row pl-4 mb-2">
                            <Details tx={tx} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </>
    );
  } else {
    return <LoadingSpinner />;
  }
}

function transactionByType(tx, blockHeight) {
  switch (tx.contract_call.function_name) {
    case 'register-user':
      return <RegisterTransaction tx={tx} />;
    case 'mine-tokens':
      return <MineTransaction tx={tx} />;
    case 'mine-many':
      return <MineManyTransaction tx={tx} blockHeight={blockHeight} />;
    case 'stack-tokens':
      return <StackTransaction tx={tx} />;
    case 'claim-mining-reward':
      return <ClaimTransaction tx={tx} />;
    case 'claim-stacking-reward':
      return <ClaimStackingTransaction tx={tx} />;
    case 'transfer':
      return <TransferTransaction tx={tx} />;
    default:
      console.log('unhandled', tx.contract_call.function_name);
      return null;
  }
}

function uintJsonToSTX(value) {
  return (
    <>
      {(hexToCV(value.hex).value / 1000000).toLocaleString(undefined, {
        maximumFractionDigits: 6,
        style: 'decimal',
      })}{' '}
      STX
    </>
  );
}

function uintJsonToRewardCycle(value) {
  return (
    <>
      Reward Cycle:{' '}
      {hexToCV(value.hex).value.toNumber().toLocaleString(undefined, {
        maximumFractionDigits: 0,
        style: 'decimal',
      })}
    </>
  );
}

function listCvToMiningAmounts(value, blockHeight) {
  const amountsJSON = cvToJSON(hexToCV(value.hex));
  let amountsTotal = 0;
  for (let i = 0; i < amountsJSON.value.length; i++) {
    amountsTotal += amountsJSON.value[i].value / 1000000;
  }
  return (
    <>
      <div className="col-6">Number of Blocks: {amountsJSON.value.length}</div>
      <div className="col-6 text-right">Total: {amountsTotal} STX</div>
      <small>
        <div className="row gy-2">
          {amountsJSON.value.map((amountBid, key) => (
            <Fragment key={key}>
              <div className="col-1">
                {parseInt(blockHeight) + key}
                <br />
                {amountBid.value / 1000000} STX
              </div>
            </Fragment>
          ))}
        </div>
      </small>
    </>
  );
}

function RegisterTransaction({ tx }) {
  return <div className="col-12">{tx.contract_call.function_name}</div>;
}

function MineTransaction({ tx }) {
  return (
    <>
      <div className="col-6">{tx.contract_call.function_name}</div>
      <div className="col-6 text-right">
        <small>{uintJsonToSTX(tx.contract_call.function_args[0])}</small>
      </div>
    </>
  );
}

function MineManyTransaction({ tx, blockHeight }) {
  return (
    <div className="col-12">
      {tx.contract_call.function_name}
      <div className="row">
        {listCvToMiningAmounts(tx.contract_call.function_args[0], blockHeight)}
      </div>
    </div>
  );
}

function StackTransaction({ tx }) {
  return <div className="col-12">{tx.contract_call.function_name}</div>;
}

function ClaimTransaction({ tx }) {
  return <div className="col-12">{tx.contract_call.function_name}</div>;
}

function ClaimStackingTransaction({ tx }) {
  return (
    <div className="col-12">
      <b>{tx.contract_call.function_name}</b>
      <br />
      <small>{uintJsonToRewardCycle(tx.contract_call.function_args[0])}</small>
    </div>
  );
}

function TransferTransaction({ tx }) {
  return <div className="col-12">{tx.contract_call.function_name}</div>;
}

function Details({ tx }) {
  return (
    <>
      <div className="col-lg-4 col-md-12">
        <small>
          <Address addr={tx.sender_address} />
        </small>
        <a
          className="text-dark ms-1"
          href={`https://explorer.stacks.co/address/${tx.sender_address}`}
          target="_blank"
          rel="noreferrer"
        >
          <i className="bi bi-box-arrow-up-right" />
        </a>
      </div>
      <div className="col-lg-4 col-md-12 text-center">
        <small>Status: {tx.tx_status}</small>
      </div>
      <div className="col-lg-4 col-md-12 text-right">
        {tx.tx_id.substr(0, 10)}...
        <a
          className="text-dark ms-1"
          href={`https://explorer.stacks.co/txid/${tx.tx_id}`}
          target="_blank"
          rel="noreferrer"
        >
          <i className="bi bi-box-arrow-up-right" />
        </a>
      </div>
    </>
  );
}

function Timestamp({ tx }) {
  const timestamp = new Date(tx.burn_block_time_iso);
  return <>{timestamp.toLocaleString()}</>;
}
