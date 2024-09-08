import { useEffect, useState } from 'react';
import { chainSuffix } from '../lib/constants';

import { UserSession } from '@stacks/auth';
import {
  TransactionEvent,
  TransactionEventStxAsset,
  TransactionEventStxLock,
} from '@stacks/stacks-blockchain-api-types';
import { StoredTx, getTx, jsonStringify } from '../lib/transactions';
import { dateOfTx } from './SendManyTxList';
import { TxEventLisaTransfer } from './TxEventLisaTransfer';
import { TxEventStxLock } from './TxEventStxLock';

export function SendManyLisaTxGroup({
  ownerStxAddress,
  userSession,
  txList,
  cycleId,
}: {
  ownerStxAddress?: string;
  userSession: UserSession;
  txList: string[];
  cycleId: number;
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
      console.log(txList.length);
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

  const txEvents =
    allTxs &&
    (allTxs.allEvents?.filter(
      event => event.event_type === 'stx_asset' || event.event_type === 'stx_lock'
    ) as
      | Array<(TransactionEventStxAsset | TransactionEventStxLock) & { tx: StoredTx }>
      | undefined);
  console.log(txEvents);
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
          Cycle #{cycleId} - {dateOfTx(allTxs.firstTx)}
          <br />
          <div className="list-group m-2">
            <div className="list-group-item">
              {txEvents?.map((event, key) => {
                if (event.event_type === 'stx_asset') {
                  return (
                    <TxEventLisaTransfer
                      key={key}
                      event={event}
                      chainSuffix={chainSuffix}
                      tx={event.tx}
                    />
                  );
                } else {
                  return (
                    <TxEventStxLock
                      key={key}
                      event={event as TransactionEventStxLock}
                      chainSuffix={chainSuffix}
                      tx={event.tx}
                    />
                  );
                }
              })}
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
