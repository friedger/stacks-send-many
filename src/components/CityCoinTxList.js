import React, { Fragment, useEffect, useState } from 'react';
import { connectWebSocketClient } from '@stacks/blockchain-api-client';
import { hexToCV } from '@stacks/transactions';
import _groupBy from 'lodash.groupby';
import {
  accountsApi,
  CITYCOIN_CONTRACT_NAME,
  CONTRACT_ADDRESS,
  STACKS_API_WS_URL,
  transactionsApi,
} from '../lib/constants';
import { Address } from './Address';

export function CityCoinTxList() {
  const [txs, setTxs] = useState();

  const updateTxs = async () => {
    try {
      const result = await accountsApi.getAccountTransactions({
        principal: `${CONTRACT_ADDRESS}.${CITYCOIN_CONTRACT_NAME}`,
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
          `${CONTRACT_ADDRESS}.${CITYCOIN_CONTRACT_NAME}`,
          async event => {
            console.log(event);

            if (event.tx_status === 'pending') {
              const mempooltx = await transactionsApi.getMempoolTransactionList();
              console.log(mempooltx);
              return;
            } else if (event.tx_status === 'success') {
              const tx = await transactionsApi.getTransactionById({ txId: event.tx_id });
              console.log({ tx });
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
    const blockHeights = txs ? Object.keys(txs).sort((a, b) => a < b) : undefined;
    return (
      <>
        <h3>Recent Activities</h3>
        <div className="container">
          {blockHeights.map((blockHeight, key) => (
            <Fragment key={key}>
              <div>
                Block #{blockHeight} (<Timestamp tx={txs[blockHeight][0]} />)
              </div>

              {txs[blockHeight].map((tx, txKey) => {
                return (
                  <div className="card p-2 m-2" key={txKey}>
                    <div className="row pl-4">{transactionByType(tx)}</div>
                    <div className="row pl-4 mb-2">
                      <Details tx={tx} />
                    </div>
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </>
    );
  } else {
    return null;
  }
}

function transactionByType(tx) {
  switch (tx.contract_call.function_name) {
    case 'register-miner':
      return <RegisterTransaction tx={tx} />;
    case 'mine-tokens':
      return <MineTransaction tx={tx} />;
    case 'mine-tokens-over-30-blocks':
      return <MineTransactionOver30Blocks tx={tx} />;
    case 'stack-tokens':
      return <StackTransaction tx={tx} />;
    case 'claim-token-rewards':
      return <ClaimTransaction tx={tx} />;
    case 'claim-stacking-rewards':
      return <ClaimStackingTransaction tx={tx} />;
    case 'transfer':
      return <TransferTransaction tx={tx} />;
    default:
      return null;
  }
}

function uintJsonToSTX(value) {
  return (
    <>
      {(hexToCV(value.hex).value.toNumber() / 1000000).toLocaleString(undefined, {
        maximumFractionDigits: 6,
        style: 'decimal',
      })}{' '}
      STX
    </>
  );
}

function RegisterTransaction({ tx }) {
  return <div className="col-12">{tx.contract_call.function_name}</div>;
}

function MineTransaction({ tx }) {
  return (
    <div className="col-12">
      {tx.contract_call.function_name}
      <br />
      <small>{uintJsonToSTX(tx.contract_call.function_args[0])}</small>
    </div>
  );
}

function MineTransactionOver30Blocks({ tx }) {
  return (
    <div className="col-12">
      <b>{tx.contract_call.function_name}</b>
      <br />
      <small>30 x {uintJsonToSTX(tx.contract_call.function_args[0])}</small>
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
      {tx.contract_call.function_name} ({tx.events[0].asset.amount})
    </div>
  );
}

function TransferTransaction({ tx }) {
  return <div className="col-12">{tx.contract_call.function_name}</div>;
}

function Details({ tx }) {
  return (
    <>
      <div className="col-lg-6 col-md-12">
        <small>
          <Address addr={tx.sender_address} />
        </small>
      </div>
      <div className="col-lg-6 col-md-12 text-right">
        <small>{tx.tx_id.substr(0, 20)}...</small>
      </div>
    </>
  );
}

function Timestamp({ tx }) {
  const timestamp = new Date(tx.burn_block_time_iso);
  return <>{timestamp.toLocaleString()}</>;
}