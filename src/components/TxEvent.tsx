
import { SUPPORTED_ASSETS } from '../lib/constants';
import { StoredTx } from '../lib/transactions';
import { TransactionEventFungibleAsset, TransactionEventStxAsset } from '../lib/types';
import { Address } from './Address';
import { AmountAsset } from './AmountAsset';
import { AmountFiat } from './AmountFiat';

export function TxEvent({
  event,
  tx,
  chainSuffix,
}: {
  event: TransactionEventFungibleAsset | TransactionEventStxAsset;
  tx: StoredTx;
  chainSuffix?: string;
}) {
  return (
    <div
      onClick={() =>
        (window.location.href = `/txid/${tx.apiData!.tx_id}/${event.event_index}${chainSuffix}`)
      }
      className="row"
      role="button"
    >
      <div className="col-8">
        <Address addr={event.asset.recipient!} />
      </div>
      <div className="col-4 text-right small">
        <AmountAsset amount={+event.asset.amount!} assetInfo={SUPPORTED_ASSETS['stx']} />
        <br />
        (<AmountFiat ustx={+event.asset.amount!} />)
      </div>
    </div>
  );
}
