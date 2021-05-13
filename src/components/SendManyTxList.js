import React, { useRef, useState, useEffect, Fragment } from 'react';

import { getTxs, getTxsAsCSV, getTxsAsJSON } from '../lib/transactions';
import DownloadLink from 'react-download-link';
import _groupBy from 'lodash.groupby';
import { Tx } from './Tx';

function dateOfTx(tx) {
  return tx.apiData.burn_block_time_iso.substring(0, 10);
}

export function SendManyTxList({ ownerStxAddress, userSession }) {
  const spinner = useRef();
  const [status, setStatus] = useState();
  const [txsByDate, setTxsByDate] = useState();

  useEffect(() => {
    setStatus('Loading');
    getTxs(userSession)
      .then(async transactions => {
        setStatus(undefined);
        setTxsByDate(_groupBy(transactions, dateOfTx));
      })
      .catch(e => {
        setStatus('Failed to get transactions', e);
        console.log(e);
      });
  }, [userSession]);

  const dates = txsByDate ? Object.keys(txsByDate) : undefined;
  return (
    <div>
      <h5>Recent Send Many transactions</h5>
      <div
        ref={spinner}
        role="status"
        className="d-none spinner-border spinner-border-sm text-info align-text-top mr-2"
      />
      {dates && dates.length > 0 && (
        <>
          {dates.map((date, key) => {
            return (
              <>
                {date}
                {txsByDate[date].map((tx, txKey) => {
                  return (
                    <>
                      <div key={txKey}>
                        <Tx tx={tx} />
                      </div>
                    </>
                  );
                })}
              </>
            );
          })}
          <div className="input-group">
            <DownloadLink
              label="Export as JSON"
              filename="transactions.json"
              exportFile={async () => {
                const txs = await getTxsAsJSON(userSession);
                return JSON.stringify(txs);
              }}
            />
            <DownloadLink
              label="Export as CSV"
              filename="transactions.csv"
              exportFile={async () => {
                return await getTxsAsCSV(userSession);
              }}
            />
          </div>
        </>
      )}
      {!status && (!dates || dates.length === 0) && <>No transactions yet.</>}
      {status && (
        <>
          <div>{status}</div>
        </>
      )}
    </div>
  );
}
