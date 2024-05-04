import React from 'react';
import { chainSuffix } from '../lib/constants';
import { Amount } from './Amount';
import { TxEvent } from './TxEvent';
import { StoredTx } from '../lib/transactions';
import { TransactionEventStxAsset } from '@stacks/stacks-blockchain-api-types';
export function Tx({
  tx,
  onDetailsPage,
  hideEvents,
  hideHeader,
}: {
  tx: StoredTx;
  onDetailsPage?: boolean;
  hideEvents?: boolean;
  hideHeader?: boolean;
}) {
  const apiData = tx.apiData;
  const txId = apiData?.tx_id;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(txId!);
  };
  const openTxInExplorer = () => {
    window.open(`https://explorer.hiro.so/txid/${txId}${chainSuffix}`, '_blank');
  };
  const openTx = () => {
    window.location.href = `/txid/${txId}`;
  };

  const txEvents = apiData?.events.filter(event => {
    return event.event_type === 'stx_asset';
  }) as TransactionEventStxAsset[] | undefined;
  const total = txEvents?.reduce((sum, e) => sum + parseInt(e.asset.amount!), 0);
  return (
    <div className="small container">
      {!hideHeader && (
        <div className="row">
          <div className="col-lg-7 col-xs-12">
            <span title={txId}>
              {txId?.substring(0, 7)}...{txId?.substring(58)}
            </span>
            <i
              className="p-1 bi bi-clipboard"
              role="button"
              title="copy"
              onClick={copyToClipboard}
            ></i>
            <i
              className={`${onDetailsPage ? 'd-none' : ''} p-1 bi bi-link`}
              role="button"
              title="details"
              onClick={openTx}
            ></i>
            <i
              className="p-1 bi bi-link-45deg"
              role="button"
              title="explorer"
              onClick={openTxInExplorer}
            ></i>
          </div>
          {total > 0 ? (
            <div className="col-lg-5 col-xs-12 text-danger text-right small">
              <Amount ustx={-1 * total} />
            </div>
          ) : (
            <div className="col-lg-5 col-xs-12 text-right small">
              {(tx.apiData && tx.apiData.tx_status) || ''}
            </div>
          )}
        </div>
      )}

      {!hideEvents &&
        txEvents &&
        txEvents.map((event, key) => {
          return <TxEvent key={key} event={event} tx={tx} chainSuffix={chainSuffix} />;
        })}
    </div>
  );
}
