import { hexToCV } from '@stacks/transactions';
import React, { useRef, useState, useEffect } from 'react';
import { CONTRACT_ADDRESS } from '../lib/constants';

import { getTx } from '../lib/transactions';
import { Address } from './Address';
import { Amount } from './Amount';
import { Tx } from './Tx';
import { ContractCall } from './ContractCall';
export function SendManyTransfer({ userSession, txId, eventIndex }) {
  const spinner = useRef();
  const [status, setStatus] = useState();
  const [tx, setTx] = useState();
  const [event, setEvent] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getTx(txId, userSession)
      .then(async transaction => {
        setStatus(undefined);
        setTx(transaction);
        setEvent(transaction.apiData.events[eventIndex]);
        console.log({ transaction });
        setLoading(false);
      })
      .catch(e => {
        setStatus('Failed to get transactions', e);
        console.log(e);
        setLoading(false);
      });
  }, [txId, eventIndex, userSession]);

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
          {showMemo && !showMemoPerRecipient && (
            <>
              <br />
              <b>"{hexToCV(memos[0]).buffer.toString()}"</b>
            </>
          )}
          {event && (
            <div className="list-group m-4">
              <div className="list-group-item">
                <div className="row">
                  <div className="col-8">
                    <small>
                      <Address addr={tx.apiData.sender_address} />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <line x1="13" y1="18" x2="19" y2="12"></line>
                        <line x1="13" y1="6" x2="19" y2="12"></line>
                      </svg>
                      <Address addr={event.asset.recipient} />
                    </small>
                  </div>
                  <div className="col-4 text-right small">
                    <Amount ustx={event.asset.amount} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="p-2">
            This STX transfer is part of following transaction:
            <Tx tx={tx} hideEvents />
          </div>
          <div className="p-2">
            Stacks Wallet shows the STX transfer as contract call only:
            <ContractCall tx={tx} />
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
