import { Address } from './Address';
import { AmountFiat } from './AmountFiat';
import { AmountStx } from './AmountStx';

export function TxEvent({ key, event, tx, chainSuffix }) {
  return (
    <div
      onClick={() =>
        (window.location.href = `/txid/${tx.apiData.tx_id}/${event.event_index}${chainSuffix}`)
      }
      key={key}
      className="row"
      role="button"
    >
      <div className="col-8">
        <Address addr={event.asset.recipient} />
      </div>
      <div className="col-4 text-right small">
        <AmountStx ustx={event.asset.amount} />
        <br />
        (<AmountFiat ustx={event.asset.amount} />)
      </div>
    </div>
  );
}
