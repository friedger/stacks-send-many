import { cvToString } from '@stacks/transactions';
import React, { useRef, useState, useEffect, Fragment } from 'react';

import { getTxs } from '../lib/transactions';
import BigNum from 'bn.js';
import DownloadLink from 'react-download-link';

export function SendManyTxList({ ownerStxAddress, userSession }) {
  const spinner = useRef();
  const [status, setStatus] = useState();
  const [exporting, setExporting] = useState(false);
  const [txs, setTxs] = useState();

  useEffect(() => {
    setStatus('Loading');
    getTxs(userSession)
      .then(async transactions => {
        setStatus(undefined);
        console.log(transactions);
        setTxs(transactions);
      })
      .catch(e => {
        setStatus('Failed to get transactions', e);
        console.log(e);
      });
  }, [userSession]);

  const exportAction = async () => {
    setExporting(true);
    await userSession;
  };
  return (
    <div>
      <h5>Recent Send Many transactions</h5>
      <div
        ref={spinner}
        role="status"
        className="d-none spinner-border spinner-border-sm text-info align-text-top mr-2"
      />
      {txs && txs.length > 0 && (
        <>
          {txs.map((tx, key) => {
            const transaction = tx.data;
            const status = tx.apiData;
            return (
              <>
                <div key={key}>
                  <a href={`/txid/${transaction.txId}`}>
                    {status ? (
                      <>
                        {status.burn_block_time_iso} ({status.tx_status})
                      </>
                    ) : (
                      transaction.txId
                    )}
                  </a>
                </div>
              </>
            );
          })}
          <div className="input-group">
            <DownloadLink
              label="Export"
              filename="transactions.json"
              exportFile={async () => {
                const txs = await getTxs(userSession);
                const exportedTxs = txs
                  .filter(tx => tx.apiData && tx.apiData.tx_status === 'success')
                  .reduce((result, tx) => {
                    console.log(tx)
                    return result.concat(
                      tx.apiData.events
                        .filter(e => e.event_type === 'stx_asset')
                        .map(e => {
                          const exportedTx = {
                            recipient: e.asset.recipient,
                            amount: e.asset.amount / 1000000,
                            timestamp: tx.apiData.burn_block_time_iso,
                            explorer_url: `https://explorer.stacks.co/txid/${tx.apiData.tx_id}`,
                            send_many_url: `https://stacks-send-many.pages.dev/txid/${tx.apiData.tx_id}`,
                          };
                          return exportedTx;
                        })
                    );
                  }, []);
                return JSON.stringify(exportedTxs);
              }}
            />
          </div>
        </>
      )}
      {!status && (!txs || txs.length === 0) && <>No transactions yet.</>}
      {status && (
        <>
          <div>{status}</div>
        </>
      )}
    </div>
  );
}
