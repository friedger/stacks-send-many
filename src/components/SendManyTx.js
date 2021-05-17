import { hexToCV } from '@stacks/transactions';
import React, { useRef, useState, useEffect } from 'react';
import { CONTRACT_ADDRESS } from '../lib/constants';

import { getTx } from '../lib/transactions';
import { Address } from './Address';
import { Tx } from './Tx';

export function SendManyTx({ ownerStxAddress, userSession, txId }) {
  const spinner = useRef();
  const [status, setStatus] = useState();
  const [tx, setTx] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getTx(txId, userSession)
      .then(async transaction => {
        setStatus(undefined);
        setTx(transaction);
        console.log({ transaction });
        setLoading(false);
      })
      .catch(e => {
        setStatus('Failed to get transactions', e);
        console.log(e);
        setLoading(false);
      });
  }, [txId, userSession]);

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
    tx &&
    tx.apiData &&
    tx.apiData.contract_call &&
    tx.apiData.contract_call.contract_id === `${CONTRACT_ADDRESS}.send-many-memo`;
  const memos = showMemo
    ? new Array(
        ...new Set(
          tx.apiData.events.filter((_, index) => index % 2 === 1).map(e => e.contract_log.value.hex)
        )
      )
    : [];
  const showMemoPerRecipient = showMemo && memos.length > 1;
  return (
    <div>
      <div
        ref={spinner}
        role="status"
        className={`${
          loading ? '' : 'd-none'
        } spinner-border spinner-border-sm text-info align-text-top mr-2`}
      />
      {tx && tx.apiData && (
        <div className="p-2 mx-n4 mt-2 mb-2 bg-light">
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
        </div>
      )}
      {tx && !tx.apiData && tx.data && <>Transaction not found on network.</>}
      {!loading && (!tx || !tx.apiData) && <>No transaction found with id {txId}.</>}
      {status && (
        <>
          <div>{status}</div>
        </>
      )}
    </div>
  );
}
