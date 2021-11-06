import { Fragment, useEffect, useState } from 'react';
import converter from 'number-to-words';
import _groupBy from 'lodash.groupby';
import { getTxs } from '../../lib/stacks';
import LinkAddress from '../common/LinkAddress';
import LinkTx from '../common/LinkTx';
import CurrentStacksBlock from '../common/CurrentStacksBlock';
import LoadingSpinner from '../common/LoadingSpinner';

export default function TransactionLog(props) {
  const [txs, setTxs] = useState();

  useEffect(() => {
    getTxs(`${props.contracts.deployer}.${props.contracts.coreContract}`)
      .then(result => {
        setTxs(
          _groupBy(
            result.filter(tx => tx.tx_status === 'success' && tx.tx_type === 'contract_call'),
            'block_height'
          )
        );
      })
      .catch(err => {
        console.log(err);
      });
  }, [props.contracts.coreContract, props.contracts.deployer]);

  const blockHeights = txs ? Object.keys(txs).sort().reverse() : undefined;

  if (txs) {
    return (
      <div className="container-fluid p-6">
        <h3>{props.token.symbol} Transactions</h3>
        <CurrentStacksBlock />
        <div className="accordion accordion-flush" id="accordionActivityLog">
          {blockHeights &&
            blockHeights.map((blockHeight, key) => (
              <Fragment key={key}>
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id={`accordionActivityLog-heading-${converter.toWords(key + 1)}`}
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#accordionActivityLog-activity-${converter.toWords(
                        key + 1
                      )}`}
                      aria-expanded="false"
                      aria-controls={`accordionActivityLog-activity-${converter.toWords(key + 1)}`}
                    >
                      Stacks Block #{blockHeight} - <TxTimestamp tx={txs[blockHeight][0]} />
                    </button>
                  </h2>

                  <div
                    id={`accordionActivityLog-activity-${converter.toWords(key + 1)}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`accordionActivityLog-heading-${converter.toWords(key + 1)}`}
                    data-bs-parent="#accordionActivityLog"
                  >
                    <div className="accordion-body">
                      {txs[blockHeight].map((tx, txKey) => {
                        return (
                          <div className="row bg-muted" key={txKey}>
                            <div className="col-md-6 col-lg-3 fw-bold">
                              {tx.contract_call.function_name}
                            </div>
                            <div className="col-md-6 col-lg-3">Status: {tx.tx_status}</div>
                            <div className="col-md-6 col-lg-3">
                              <LinkAddress address={tx.sender_address} />
                            </div>
                            <div className="col-md-6 col-lg-3">
                              <LinkTx txId={tx.tx_id} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Fragment>
            ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="container-fluid p-6">
        <h3>{props.token.symbol} Transactions</h3>
        <LoadingSpinner />
      </div>
    );
  }
}

function TxTimestamp({ tx }) {
  const timestamp = new Date(tx.burn_block_time_iso);
  return <>{timestamp.toLocaleString()}</>;
}
