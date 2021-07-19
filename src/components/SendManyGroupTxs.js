import { hexToCV } from '@stacks/transactions';
import React, { useState, useEffect } from 'react';
import { CONTRACT_ADDRESS } from '../lib/constants';

import { getTx } from '../lib/transactions';
import { Address } from './Address';
import { Amount } from './Amount';
import { Tx } from './Tx';

export function SendManyGroupTxs({ ownerStxAddress, userSession, txList }) {
  const [status, setStatus] = useState();
  const [allTxs, setAllTxs] = useState();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (txList && txList.length > 0) {
      setProgress(0);

      const loadTxs = async () => {
        try {
          setProgress(100 / (txList.length + 1));
          const firstTx = await getTx(txList[0], userSession);
          const txs = [firstTx];
          let allEvents = firstTx.apiData.events
          for (let i = 1; i < txList.length; i++) {
            setProgress(((i + 1) * 100) / (txList.length + 1));
            const transaction = await getTx(txList[i], userSession);
            allEvents = allEvents.concat(transaction.apiData.events);
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

  const txEvents = allTxs
    ? allTxs.txs.reduce((result, tx) => {
        if (tx.apiData) {
          result = result.concat(
            tx.apiData.events.filter(event => {
              return event.event_type === 'stx_asset';
            })
          );
        }
        return result;
      }, [])
    : [];
  txEvents &&
    txEvents.sort((e1, e2) =>
      (e1.asset.recipient !== ownerStxAddress && e2.asset.recipient !== ownerStxAddress) ||
      (e1.asset.recipient === ownerStxAddress && e2.asset.recipient === ownerStxAddress)
        ? e1.asset.recipient > e2.asset.recipient
        : e1.asset.recipient === ownerStxAddress
        ? -1
        : 1
    );
  const showMemo =
    allTxs &&
    allTxs.firstTx &&
    allTxs.firstTx.apiData.contract_call.contract_id === `${CONTRACT_ADDRESS}.send-many-memo`;
  const duplicateMemos = allTxs
    ? allTxs.txs.reduce(
        (result, tx) =>
          result.concat(
            tx.apiData.events
              .filter((_, index) => index % 2 === 1)
              .map(e => e.contract_log.value.hex)
          ),
        []
      )
    : [];
  const memos = showMemo ? new Array(...new Set(duplicateMemos)) : [];
  const showMemoPerRecipient = showMemo && memos.length > 1;
  const total = allTxs
    ? allTxs.allEvents
        .filter(event => {
          return event.event_type === 'stx_asset';
        })
        .reduce((sum, e) => sum + parseInt(e.asset.amount), 0)
    : 0;
  return (
    <div>
      <div className={`progress ${progress < 100 ? '' : 'd-none'}`}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
      {allTxs && allTxs.firstTx && allTxs.firstTx.apiData && (
        <>
          {allTxs.firstTx.apiData.burn_block_time_iso?.substring(0, 10) || 'pending'} (
          {allTxs.firstTx.apiData.tx_status})
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
          {showMemo && !showMemoPerRecipient && <b>"{hexToCV(memos[0]).buffer.toString()}"</b>}
          {total && (
            <div className="p-4">
              Total transfer <Amount ustx={total} />
            </div>
          )}
          <div className="list-group m-2">
            <div className="list-group-item">
              {allTxs.txs.map((tx, key) => (
                <Tx tx={tx} key={key} onDetailsPage hideHeader />
              ))}
            </div>
          </div>
        </>
      )}

      {allTxs && allTxs.firstTx && !allTxs.firstTx.apiData && allTxs.firstTx.data && (
        <>Transaction not found on server.</>
      )}
      {progress >= 100 && allTxs && !allTxs.firstTx && (
        <>No transactions found with id {JSON.stringify(txList)}.</>
      )}
      {status && (
        <>
          <div>{status}</div>
        </>
      )}
    </div>
  );
}
