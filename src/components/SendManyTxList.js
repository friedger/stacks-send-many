import React, { useRef, useState, useEffect, Fragment } from 'react';

import { getTxs, getTxsAsCSV, getTxsAsJSON } from '../lib/transactions';
import DownloadLink from 'react-download-link';
import _groupBy from 'lodash.groupby';
import { Tx } from './Tx';

function dateOfTx(tx) {
  return tx.apiData?.burn_block_time_iso?.substring(0, 10) || 'pending';
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
      <div className="row">
        <div className="col-6 mb-4">
          <h5>Recent Send Many transactions</h5>
        </div>
        <div className="col-6">
          <form>
            <div className="form-row align-items-center">
              <div className="col-auto mb-2 input-group bg-white input-group-sm">
                <div className="input-group-prepend bg-white">
                  <img src="/search.png" width="32" height="31" className="p-2 input-group-text bg-white" id="inputGroup-sizing-sm"/>
                </div>
                <input type="text" className="form-control mr-2" placeholder="Search for address, date, amount"/>
                <div  className="btn-group" role="group">
                <div className="dropdown">
                  <button className="btn btn-sm btn-dark dropdown-toggle mb-2" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Export
                  </button>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton"> 
                    <DownloadLink
                      label="Export as JSON"
                      filename="transactions.json"
                      className="dropdown-item text-decoration-none text-dark"
                      exportFile={async () => {
                        const txs = await getTxsAsJSON(userSession);
                        return JSON.stringify(txs);
                      }}
                    />
                    <DownloadLink
                      label="Export as CSV"
                      filename="transactions.csv"
                      className="dropdown-item text-decoration-none text-dark"
                      exportFile={async () => {
                        return await getTxsAsCSV(userSession);
                      }}
                    />
                  </div>
                </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div
        ref={spinner}
        role="status"
        className="d-none spinner-border spinner-border-sm text-info align-text-top mr-2"
      />
      {dates && dates.length > 0 && (
        <>
          {dates.map((date, key) => {
            return (
              <div className="list-group" id="transactions">
              <Fragment key={key}>
                <div className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                  <span className="small">{date}</span>
                  <span className="small font-weight-bold">Total: </span>
                </div>
                {txsByDate[date].map((tx, txKey) => {
                  return (
                    <>
                      <div className="p-2 mx-n4 mt-2 mb-2" key={txKey}>
                        <Tx tx={tx} />
                      </div>
                    </>
                  );
                })}
                </div>
              </Fragment>
              </div>
            );
          })} 
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
