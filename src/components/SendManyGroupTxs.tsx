import { BufferCV, hexToCV } from '@stacks/transactions';
import React, { useState, useEffect } from 'react';
import { chainSuffix, CONTRACT_ADDRESS } from '../lib/constants';

import { StoredTx, getTx, jsonStringify } from '../lib/transactions';
import { Address } from './Address';
import { Amount } from './Amount';
import { TxEvent } from './TxEvent';
import {
  TransactionEvent,
  TransactionEventSmartContractLog,
  TransactionEventStxAsset,
} from '@stacks/stacks-blockchain-api-types';
import { dateOfTx } from './SendManyTxList';

export function SendManyGroupTxs({
  ownerStxAddress,
  userSession,
  txList,
}: {
  ownerStxAddress: string;
  userSession: any;
  txList: string[];
}) {
  const [status, setStatus] = useState<string>();
  const [allTxs, setAllTxs] = useState<{
    firstTx: StoredTx;
    txs: StoredTx[];
    allEvents?: Array<TransactionEvent & { tx: StoredTx }>;
  }>();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (txList && txList.length > 0) {
      setProgress(0);

      const loadTxs = async () => {
        try {
          setProgress(100 / (txList.length + 1));
          const firstTx = await getTx(txList[0], userSession);
          const txs = [firstTx];
          let allEvents = firstTx.apiData?.events.map(e => {
            return { ...e, tx: firstTx };
          });
          for (let i = 1; i < txList.length; i++) {
            setProgress(((i + 1) * 100) / (txList.length + 1));
            const transaction = await getTx(txList[i], userSession);
            allEvents = allEvents?.concat(
              transaction.apiData?.events.map(e => {
                return { ...e, tx: transaction };
              }) || []
            );
            txs.push(transaction);
          }
          setAllTxs({ firstTx, txs, allEvents });
          setProgress(100);
        } catch (e) {
          setStatus(`Failed to get transactions`);
          console.log(e);
          setProgress(100);
        }
      };
      loadTxs();
    }
  }, [txList, userSession]);

  console.log({ a: allTxs && allTxs.allEvents });
  const txEvents =
    allTxs &&
    (allTxs.allEvents?.filter(event => event.event_type === 'stx_asset') as
      | Array<TransactionEventStxAsset & { tx: StoredTx }>
      | undefined);

  txEvents &&
    txEvents.sort((e1, e2) => {
      if (e1.asset.recipient === ownerStxAddress && e2.asset.recipient !== ownerStxAddress)
        return -1;
      if (e1.asset.recipient !== ownerStxAddress && e2.asset.recipient === ownerStxAddress)
        return 1;
      return e1.asset.recipient! > e2.asset.recipient! ? 1 : -1;
    });
  const duplicateMemos = allTxs
    ? allTxs.txs.reduce((result, tx) => {
        if (
          tx.apiData?.tx_type === 'contract_call' &&
          tx.apiData.contract_call.contract_id === `${CONTRACT_ADDRESS}.send-many-memo`
        ) {
          return result.concat(
            (tx.apiData.events as TransactionEventSmartContractLog[])
              ?.filter((_, index) => index % 2 === 1)
              .map(e => e.contract_log.value.hex)
          );
        } else {
          return result;
        }
      }, [] as string[])
    : [];
  const showMemo = duplicateMemos.length > 0;
  const memos = showMemo ? new Array(...new Set(duplicateMemos)) : [];

  const showMemoPerRecipient = showMemo && memos.length > 1;
  const total = txEvents ? txEvents.reduce((sum, e) => sum + parseInt(e.asset.amount!), 0) : 0;
  const allRecipients =
    txEvents &&
    new Array(
      ...new Set(
        txEvents.reduce((recipients, e) => {
          recipients.push(e.asset.recipient!);
          return recipients;
        }, [] as string[])
      )
    );
  return (
    <div>
      <div className={`progress ${progress < 100 ? '' : 'd-none'}`}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {allTxs && allTxs.firstTx && allTxs.firstTx.apiData && (
        <>
          {dateOfTx(allTxs.firstTx)} ({allTxs.firstTx.apiData.tx_status})
          <br />
          from{' '}
          <span
            className={`${
              allTxs.firstTx.apiData.sender_address === ownerStxAddress ? 'font-weight-bold' : ''
            }`}
          >
            <Address addr={allTxs.firstTx.apiData.sender_address} />
          </span>
          <br />
          {showMemo && !showMemoPerRecipient && (
            <b>"{(hexToCV(memos[0]) as BufferCV).buffer.toString()}"</b>
          )}
          {total && (
            <div className="p-4">
              Total transfer <Amount asset="stx" amount={total} /> to {allRecipients?.length}{' '}
              addresses.
            </div>
          )}
          <div className="list-group m-2">
            <div className="list-group-item">
              {txEvents?.map((event, key) => (
                <TxEvent key={key} event={event} chainSuffix={chainSuffix} tx={event.tx} />
              ))}
            </div>
          </div>
        </>
      )}

      {allTxs && allTxs.firstTx && !allTxs.firstTx.apiData && allTxs.firstTx.data && (
        <>Transaction not found on server.</>
      )}
      {progress >= 100 && allTxs && !allTxs.firstTx && (
        <>No transactions found with id {jsonStringify(txList)}.</>
      )}
      {status && (
        <>
          <div>{status}</div>
        </>
      )}
    </div>
  );
}
