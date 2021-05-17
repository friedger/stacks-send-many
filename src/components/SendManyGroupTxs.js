import { hexToCV } from '@stacks/transactions';
import React, { useState, useEffect } from 'react';
import { CONTRACT_ADDRESS } from '../lib/constants';

import { getTx } from '../lib/transactions';
import { Address } from './Address';
import { Amount } from './Amount';
import { Tx } from './Tx';

export function SendManyGroupTxs({ ownerStxAddress, userSession, txList }) {
  const [status, setStatus] = useState();
  const [tx, setTx] = useState();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (txList && txList.length > 0) {
      setProgress(0);

      const loadTxs = async () => {
        try {
          setProgress(100 / (txList.length + 1));
          const firstTx = await getTx(txList[0], userSession);
          console.log(firstTx.apiData.events.length, firstTx.apiData.event_count);
          for (let i = 1; i < txList.length; i++) {
            setProgress(((i + 1) * 100) / (txList.length + 1));
            const transaction = await getTx(txList[i], userSession);
            firstTx.apiData.events = firstTx.apiData.events.concat(transaction.apiData.events);
            firstTx.apiData.event_count += transaction.apiData.event_count;
            console.log(firstTx.apiData.events.length, firstTx.apiData.event_count);
          }
          setTx(firstTx);
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

  const txEvents =
    tx &&
    tx.apiData &&
    tx.apiData.events.filter(event => {
      return event.event_type === 'stx_asset';
    });
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
    tx && tx.apiData.contract_call.contract_id === `${CONTRACT_ADDRESS}.send-many-memo`;
  const memos = showMemo
    ? new Array(
        ...new Set(
          tx.apiData.events.filter((_, index) => index % 2 === 1).map(e => e.contract_log.value.hex)
        )
      )
    : [];
  console.log(txEvents);
  const showMemoPerRecipient = showMemo && memos.length > 1;
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
      {tx && tx.apiData && (
        <>
          {tx.apiData.burn_block_time_iso?.substring(0, 10) || 'pending'} ({tx.apiData.tx_status})
          <br />
          from{' '}
          <span
            className={`${tx.apiData.sender_address === ownerStxAddress ? 'font-weight-bold' : ''}`}
          >
            <Address addr={tx.apiData.sender_address} />
          </span>
          <br />
          {showMemo && !showMemoPerRecipient && <b>"{hexToCV(memos[0]).buffer.toString()}"</b>}
          <div className="list-group m-2">
            <div className="list-group-item">
              <Tx tx={tx} onDetailsPage />
            </div>
          </div>
        </>
      )}

      {tx && !tx.apiData && tx.data && <>Transaction not found on server.</>}
      {progress >= 100 && !tx && <>No transactions found with id {JSON.stringify(txList)}.</>}
      {status && (
        <>
          <div>{status}</div>
        </>
      )}
    </div>
  );
}
