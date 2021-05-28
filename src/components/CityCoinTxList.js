import { connectWebSocketClient } from '@stacks/blockchain-api-client';
import React, { useEffect, useState } from 'react';
import {
  accountsApi,
  CITYCOIN_CONTRACT_NAME,
  CONTRACT_ADDRESS,
  STACKS_API_WS_URL,
  transactionsApi,
} from '../lib/constants';

export function CityCoinTxList() {
  const [txs, setTxs] = useState();

  const updateTxs = async () => {
    try {
      const result = await accountsApi.getAccountTransactions({
        principal: `${CONTRACT_ADDRESS}.${CITYCOIN_CONTRACT_NAME}`,
      });
      setTxs(
        result.results.filter(tx => tx.tx_status === 'success' && tx.tx_type === 'contract_call')
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

  if (txs && txs.length > 0) {
    return (
      <>
        <h3>Recent Activities</h3>
        {txs.map((tx, key) => {
          console.log({ tx, key });
          switch (tx.contract_call.function_name) {
            case 'register-miner':
              return <RegisterTransaction key={key} tx={tx} />;
            case 'mine-tokens':
              return <MineTransaction key={key} tx={tx} />;
            case 'stack-tokens':
              return <StackTransaction key={key} tx={tx} />;
            case 'claim-token-rewards':
              return <ClaimTransaction key={key} tx={tx} />;
            case 'claim-stacking-rewards':
              return <ClaimStackingTransaction key={key} tx={tx} />;
            case 'transfer':
              return <TransferTransaction key={key} tx={tx} />;
            default:
              return null;
          }
        })}
      </>
    );
  } else {
    return null;
  }
}

function RegisterTransaction({ tx }) {
  return <>{tx.contract_call.function_name}</>;
}

function MineTransaction({ tx }) {
  return <>{tx.contract_call.function_name}</>;
}

function StackTransaction({ tx }) {
  return <>{tx.contract_call.function_name}</>;
}

function ClaimTransaction({ tx }) {
  return <>{tx.contract_call.function_name}</>;
}

function ClaimStackingTransaction({ tx }) {
  return <>{tx.contract_call.function_name}</>;
}

function TransferTransaction({ tx }) {
  return <>{tx.contract_call.function_name}</>;
}
