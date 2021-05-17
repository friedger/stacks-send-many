import React, { useRef, useState, useEffect, Fragment } from 'react';

import { getTxs, getTxsAsCSV, getTxsAsJSON } from '../lib/transactions';
import DownloadLink from 'react-download-link';
import _groupBy from 'lodash.groupby';
import { Tx } from './Tx';

function dateOfTx(tx) {
  return tx.apiData?.burn_block_time_iso?.substring(0, 10) || 'pending';
}

function foundInSenderAddress(tx, search) {
  return tx.apiData && tx.apiData.sender_address.indexOf(search) >= 0;
}

function foundInEvents(tx, search) {
  return (
    tx.apiData &&
    tx.apiData.events.findIndex(
      e =>
        e.event_type === 'stx_asset' &&
        (e.asset.recipient.indexOf(search) >= 0 || e.asset.amount.indexOf(search) >= 0)
    ) >= 0
  );
}

export function SendManyTxList({ ownerStxAddress, userSession }) {
  const [status, setStatus] = useState();
  const searchRef = useRef();
  const [txs, setTxs] = useState();
  const [filteredTxsByDate, setFilteredTxsByDate] = useState();
  const [exportFormat, setExportFormat] = useState('csv');
  const [exporting, setExporting] = useState(false);
  useEffect(() => {
    setStatus('Loading');
    getTxs(userSession)
      .then(async transactions => {
        setStatus(undefined);
        const txsByDate = _groupBy(transactions, dateOfTx);
        setTxs({ transactions, txsByDate });
        setFilteredTxsByDate(txsByDate);
      })
      .catch(e => {
        setStatus('Failed to get transactions', e);
        console.log(e);
      });
  }, [userSession]);

  const filter = search => t => {
    return !search || foundInSenderAddress(t, search) || foundInEvents(t, search);
  };
  const filterAndGroup = search => {
    if (!txs) return;
    setFilteredTxsByDate(_groupBy(txs.transactions.filter(filter(search)), dateOfTx));
  };
  const dates = filteredTxsByDate ? Object.keys(filteredTxsByDate).sort() : undefined;
  return (
    <div>
      <div className="row m-2">
        <div className="col-6">
          <h5>Recent Send Many transactions</h5>
        </div>
        <div className="col-6 container">
          <div className="row">
            <div className="col-12 input-group bg-white input-group-sm">
              <div className="input-group-prepend bg-white">
                <img
                  src="/search.png"
                  width="32"
                  height="32"
                  className="p-2 input-group-text bg-white"
                  alt="search"
                />
              </div>
              <input
                type="text"
                ref={searchRef}
                className="input-group form-control"
                placeholder="Search for address, date, amount"
                onChange={e => {
                  filterAndGroup(e.target.value);
                }}
              />
            </div>
            <div className="col-12 text-right">
              <div className="input-group mt-2">
                <div className="input-group-prepend">
                  {exportFormat === 'csv' ? (
                    <DownloadLink
                      style={{ textDecoration: '' }}
                      className="btn btn-dark m-0"
                      tagName="button"
                      label="Export"
                      filename="transactions.csv"
                      exportFile={async () => {
                        setExporting(true);
                        const result = await getTxsAsCSV(
                          userSession,
                          filter(searchRef.current.value.trim())
                        );
                        setExporting(false);
                        return result;
                      }}
                    />
                  ) : (
                    <DownloadLink
                      style={{ textDecoration: '' }}
                      className="btn btn-dark m-0"
                      tagName="button"
                      label="Export"
                      filename="transactions.json"
                      exportFile={async () => {
                        setExporting(true);
                        const txs = await getTxsAsJSON(
                          userSession,
                          filter(searchRef.current.value.trim())
                        );
                        const result = JSON.stringify(txs);
                        setExporting(false);
                        return result;
                      }}
                    />
                  )}
                </div>
                <select
                  className="form-control"
                  value={exportFormat}
                  onChange={e => setExportFormat(e.target.value)}
                  aria-label="Export format"
                >
                  <option value="csv">as CSV</option>
                  <option value="json">as JSON</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        role="status"
        className={`${
          exporting ? '' : 'd-none'
        } spinner-border spinner-border-sm text-info align-text-top mr-2 inline`}
      />
      {dates && dates.length > 0 && (
        <>
          {dates.map((date, key) => {
            return (
              <div className="list-group m-2" id="transactions" key={key}>
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <span className="small">{date}</span>
                  </div>
                  {filteredTxsByDate[date].map((tx, txKey) => {
                    return (
                      <Fragment key={txKey}>
                        <div className="p-2 mx-n4 mt-2 mb-2" key={txKey}>
                          <Tx tx={tx} />
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}
      {!status && (!dates || dates.length === 0) && <>No transactions yet.</>}
      {status && <div className="m-2">{status}</div>}
    </div>
  );
}
