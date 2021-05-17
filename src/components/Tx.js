import React from 'react';
import { Address } from './Address';
import { Amount } from './Amount';
export function Tx({ tx, onDetailsPage }) {
  const apiData = tx.apiData;
  const txId = apiData.tx_id;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(txId);
  };
  const openTxInExplorer = () => {
    window.open(`https://explorer.stacks.co/txid/${txId}`, '_blank');
  };
  const openTx = () => {
    window.location.href = `/txid/${txId}`;
  };

  const txEvents =
    tx &&
    tx.apiData &&
    tx.apiData.events.filter(event => {
      return event.event_type === 'stx_asset';
    });
  const total = txEvents.reduce((sum, e) => sum + parseInt(e.asset.amount), 0);
  return (
    <div className="small container">
      <div className="row">
        <div className="col-9">
          <span title={txId}>
            {txId.substr(0, 7)}...{txId.substr(58)}
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
        <div className="col-3 text-danger text-right small">
          <Amount ustx={-1 * total} />
        </div>
      </div>

      {txEvents &&
        txEvents.map((event, key) => {
          return (
            <div key={key} className="row">
              <div className="col-8">
                <Address addr={event.asset.recipient} />
              </div>
              <div className="col-3 text-right small">
                <Amount ustx={event.asset.amount} />
              </div>
            </div>
          );
        })}
    </div>
  );
}
