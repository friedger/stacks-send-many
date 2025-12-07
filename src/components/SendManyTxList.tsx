import React, { CSSProperties, Fragment, useCallback, useEffect, useRef, useState } from 'react';

import _groupBy from 'lodash.groupby';
import DownloadLinkDef from 'react-download-link';
import { Link } from 'react-router-dom';
import { chainSuffix } from '../lib/constants';
import { useStxAddresses } from '../lib/hooks';
import { StoredTx, getTxs, getTxsAsCSV, getTxsAsJSON, jsonStringify } from '../lib/transactions';
import { Tx } from './Tx';
// FIXME: DownloadLink type definitions are wrong
// className somehow is passed but the types are out of date
const DownloadLink = DownloadLinkDef as unknown as React.FC<{
  filename?: string;
  label?: string | number | React.JSX.Element;
  className?: string;
  style?: CSSProperties;
  tagName?: string;
  exportFile?(type?: string): void;
}>;

export function dateOfTx(tx: StoredTx) {
  if (tx.apiData && tx.apiData.tx_status === "success") {
    return tx.apiData.burn_block_time_iso?.substring(0, 10);
  }
  return 'unconfirmed';
}

function foundInSenderAddress(tx: StoredTx, search: string) {
  return tx.apiData && tx.apiData.sender_address.indexOf(search) >= 0;
}

function foundInTxId(tx: StoredTx, search: string) {
  return tx.apiData && tx.apiData.tx_id.indexOf(search) >= 0;
}

function foundInEvents(tx: StoredTx, search: string) {
  return (
    tx.apiData && tx.apiData.tx_status === 'success' &&
    tx.apiData.events.findIndex(
      e =>
        e.event_type === 'stx_asset' &&
        (e.asset.recipient!.indexOf(search) >= 0 ||
          e.asset.amount!.indexOf(search) >= 0)
    ) >= 0
  );
}

export function SendManyTxList() {

  const [status, setStatus] = useState<string>();
  const searchRef = useRef<HTMLInputElement>(null);
  const [txs, setTxs] = useState<{
    transactions: StoredTx[];
    txsByDate: { [index: number]: StoredTx[] };
  }>({ transactions: [], txsByDate: {} });
  const [filteredTxsByDate, setFilteredTxsByDate] = useState<{ [x: string]: StoredTx[] }>({});
  const [exportFormat, setExportFormat] = useState('csv');
  const [exporting, setExporting] = useState(false);
  const { ownerStxAddress } = useStxAddresses();
  const filter = (search?: string) => (t: StoredTx) => {
    return Boolean(
      !search ||
      foundInSenderAddress(t, search) ||
      foundInTxId(t, search) ||
      foundInEvents(t, search)
    );
  };
  const filterAndGroup = useCallback(
    (
      txs: {
        transactions: StoredTx[];
        txsByDate: { [index: number]: StoredTx[] };
      },
      search: string
    ) => {
      if (!txs) return;
      setFilteredTxsByDate(_groupBy(txs.transactions.filter(filter(search)), dateOfTx));
    },
    []
  );

  useEffect(() => {
    setStatus('Loading');
    if (!ownerStxAddress) {
      setStatus('No Stacks address found');
      return;
    }
    getTxs(ownerStxAddress)
      .then(async transactions => {
        setStatus(undefined);
        const txsByDate = _groupBy(transactions, dateOfTx);
        const txsObject = { transactions, txsByDate };
        setTxs(txsObject);
        const searchTerm = searchRef.current?.value.trim();
        if (searchTerm) {
          filterAndGroup(txsObject, searchTerm);
        } else {
          setFilteredTxsByDate(txsByDate);
        }
      })
      .catch(e => {
        setStatus('Failed to get transactions');
        console.log(e);
      });
  }, [ownerStxAddress, filterAndGroup]);

  const dates = filteredTxsByDate
    ? // FIXME: I'm not touching this lol I think it needs some date comparison or something tho
    Object.keys(filteredTxsByDate).sort((a, b) => +a - +b)
    : undefined;
  return (
    <div>
      <div className="row m-2">
        <div className="col-6">
          <h5>Recent Send Many transactions</h5>
        </div>
        <div className="col-6 container">
          <div className="row">
            <div className="col-md-6 col-xs-12 input-group input-group-sm p-0">
              <div className="input-group-prepend bg-white">
                <img
                  src="/search.png"
                  width="32"
                  height="31"
                  className="p-2 input-group-text bg-white"
                  alt="search"
                />
              </div>
              <input
                type="text"
                ref={searchRef}
                className="input-group form-control"
                placeholder="Search for tx, address, date, amount"
                onChange={e => {
                  filterAndGroup(txs, e.target.value);
                }}
              />
            </div>
            <div className="col-md-6 col-xs-12 text-right pl-1">
              <div className="input-group">
                <div className="input-group-prepend">
                  {exportFormat === 'csv' ? (
                    <DownloadLink
                      style={{ textDecoration: '' }}
                      className="btn btn-dark m-0 btn-sm"
                      tagName="button"
                      label="Export"
                      filename="transactions.csv"
                      exportFile={async () => {
                        if (!ownerStxAddress) {
                          return "No Stacks address available for export";
                        }
                        setExporting(true);

                        const result = await getTxsAsCSV(
                          ownerStxAddress,
                          filter(searchRef.current?.value.trim())
                        );
                        setExporting(false);
                        return result;
                      }}
                    />
                  ) : (
                    <DownloadLink
                      style={{ textDecoration: '' }}
                      className="btn btn-dark m-0 btn-sm"
                      tagName="button"
                      label="Export"
                      filename="transactions.json"
                      exportFile={async () => {
                        if (!ownerStxAddress) {
                          return "no stx address"
                        }
                        setExporting(true);
                        const txs = await getTxsAsJSON(
                          ownerStxAddress,
                          filter(searchRef.current?.value.trim())
                        );
                        const result = jsonStringify(txs);
                        setExporting(false);
                        return result;
                      }}
                    />
                  )}
                </div>
                <select
                  className="form-control custom-select-sm small"
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
        className={`${exporting ? '' : 'd-none'
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
                        <div className="p-2 mx-n4 my-2" key={txKey}>
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
      {!status &&
        (!dates || dates.length === 0) &&
        (searchRef.current &&
          searchRef.current.value.trim() &&
          searchRef.current.value.trim().startsWith('0x') &&
          searchRef.current.value.trim().length === 66 ? (
          <Link to={`/txid/${searchRef.current.value.trim()}${chainSuffix}`}>
            See transaction details
          </Link>
        ) : (
          <>No transactions yet</>
        ))}
      {status && <div className="m-2">{status}</div>}
    </div>
  );
}
