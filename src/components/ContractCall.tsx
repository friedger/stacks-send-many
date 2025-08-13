import { StoredTx } from '../lib/transactions';
import { ContractCallTransaction } from '../lib/types';
export function ContractCall({ tx }: { tx: StoredTx }) {
  return (
    <div className="small container bg-white">
      <div className="row">
        <div className="col-2">
          <img src="/contractcall.png" alt="contract call" className="mx-2" />
        </div>
        <div className="col-7">
          Contract Call
          <br />
          <span className="text-muted">
            Function Call{' '}
            {new Date((tx.apiData as ContractCallTransaction).burn_block_time_iso).toLocaleString()}
          </span>
        </div>
        <div className="col-3 text-right">
          {(Number((tx.apiData as ContractCallTransaction).fee_rate) / 1000000).toLocaleString(
            undefined,
            {
              style: 'decimal',
              minimumFractionDigits: 6,
              maximumFractionDigits: 6,
            }
          )}
          Ӿ
        </div>
      </div>
    </div>
  );
}
