import { TransactionEventStxLock } from '@stacks/stacks-blockchain-api-types';
import { SUPPORTED_ASSETS } from '../lib/constants';
import { StoredTx } from '../lib/transactions';
import { AmountAsset } from './AmountAsset';
import { AmountFiat } from './AmountFiat';

export function TxEventStxLock({
  event,
  tx,
  chainSuffix,
}: {
  event: TransactionEventStxLock;
  tx: StoredTx;
  chainSuffix?: string;
}) {
  return (
    <>
      <div
        onClick={() =>
          (window.location.href = `/txid/${tx.apiData!.tx_id}/${event.event_index}${chainSuffix}`)
        }
        className="row"
        role="button"
      >
        <div className="col-6">
          {event.stx_lock_event.locked_address!.split('.')[1]} locked until
        </div>
        <div className="col-2 text-right small">{event.stx_lock_event.unlock_height!}</div>
        <div className="col-4 text-right small">
          <AmountAsset
            amount={+event.stx_lock_event.locked_amount!}
            assetInfo={SUPPORTED_ASSETS['stx']}
          />
          <br />
          (<AmountFiat ustx={+event.stx_lock_event.locked_amount!} />)
        </div>
      </div>
    </>
  );
}
