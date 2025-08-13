import { BufferCV, hexToCV } from '@stacks/transactions';
import { useEffect, useRef, useState } from 'react';
import { CONTRACT_ADDRESS } from '../lib/constants';

import { StoredTx, getTx } from '../lib/transactions';
import { Address } from './Address';
import { Amount } from './Amount';
import { Tx } from './Tx';
import { TransactionEvent, TransactionEventFungibleAsset, TransactionEventSmartContractLog, TransactionWithEvents } from '../lib/types';
export function SendManyTransfer({
  txId,
  eventIndex,
}: {
  txId: string;
  eventIndex: number;
}) {
  const spinner = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<string>();
  const [tx, setTx] = useState<StoredTx>();
  const [event, setEvent] = useState<TransactionEvent>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    setLoading(true);
    getTx(txId)
      .then(async transaction => {
        if (transaction.apiData?.tx_status !== 'success') {
          setLoading(false)
          return;
        }
        const event = transaction.apiData.events[eventIndex]
        setStatus(undefined);
        setTx(transaction);
        setEvent(event);
        setLoading(false);
      })
      .catch(e => {
        setStatus('Failed to get transactions');
        console.log(e);
        setLoading(false);
      });
  }, [txId, eventIndex]);

  const showMemo =
    tx &&
    tx.apiData &&
    tx.apiData.tx_type === 'contract_call' &&
    tx.apiData.contract_call &&
    tx.apiData.contract_call.contract_id === `${CONTRACT_ADDRESS}.send-many-memo`;
  const memos = showMemo
    ? new Array(
      ...new Set(
        (tx.apiData as TransactionWithEvents)?.events
          .filter((_, index) => index % 2 === 1)
          .map(e => (e as TransactionEventSmartContractLog).contract_log.value.hex)
      )
    )
    : [];
  const showMemoPerRecipient = showMemo && memos.length > 1;

  const burnBlockTimeIso = tx?.apiData && 'burn_block_time_iso' in tx.apiData
    ? tx.apiData.burn_block_time_iso
    : undefined;

  return (
    <div>
      <div
        ref={spinner}
        role="status"
        className={`${loading ? '' : 'd-none'
          } spinner-border spinner-border-sm text-info align-text-top mr-2`}
      />
      {tx && tx.apiData && burnBlockTimeIso && (
        <div className="p-2 mx-n4 mt-2 mb-2 bg-light">
          {burnBlockTimeIso.substring(0, 10) ||
            'pending'}{' '}
          ({tx.apiData.tx_status})
          {showMemo && !showMemoPerRecipient && (
            <>
              <br />
              <b>"{(hexToCV(memos[0]) as BufferCV).value}"</b>
            </>
          )}
          <div className="list-group m-4">
            <div className="list-group-item container">
              {event ? (
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
                      <Address addr={(event as TransactionEventFungibleAsset).asset.recipient} />
                    </small>
                  </div>
                  <div className="col-4 text-right small">
                    <Amount
                      asset="stx"
                      amount={+(event as TransactionEventFungibleAsset).asset.amount}
                    />
                  </div>
                </div>
              ) : (
                <>Invalid event index {eventIndex}</>
              )}
            </div>
          </div>
          <div className="p-2">
            This STX transfer is part of following transaction:
            <Tx tx={tx} hideEvents />
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
