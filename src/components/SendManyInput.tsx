import { useRef } from 'react';
import { Row } from './SendManyInputContainer';
export function SendManyInput({
  index,
  row,
  updateModel,
  maybeAddNewRow,
  lastRow,
}: {
  index: number;
  row: Row;
  updateModel: (data: { to: string; stx: string; memo: string }) => void;
  maybeAddNewRow: () => void;
  lastRow: boolean;
}) {
  const to = useRef<HTMLInputElement>(null);
  const stxValue = useRef<HTMLInputElement>(null);
  const memo = useRef<HTMLInputElement>(null);

  const getRow = () => {
    const value = {
      to: to.current!.value.trim(),
      stx: stxValue.current!.value.trim(),
      memo: memo.current!.value,
    };
    return value;
  };

  return (
    <div key={index}>
      <div className="row">
        <div className="col-md-5 col-xs-5 col-lg-5">
          <div className="form-label-group">
            <input
              ref={to}
              id={`wallet-address-${index}`}
              value={row.to}
              onChange={e => updateModel(getRow())}
              placeholder={``}
              type="text"
              className="form-control"
              required
              autoFocus={lastRow}
            />
            <label htmlFor={`wallet-address-${index}`}>Wallet Address #{index + 1}</label>
          </div>
        </div>
        <div className="col-md-4 col-xs-4 col-lg-4">
          <div className="form-label-group">
            <input
              ref={stxValue}
              id={`amount-${index}`}
              value={row.stx}
              onChange={e => updateModel(getRow())}
              placeholder={``}
              type="text"
              className="form-control"
              required
            />
            <label htmlFor={`amount-${index}`}>Amount #{index + 1}</label>
          </div>
        </div>
        <div className="col-md-3 col-xs-3 col-lg-3">
          <div className="form-label-group">
            <input
              ref={memo}
              id={`memo-${index}`}
              value={row.memo}
              onChange={e => updateModel(getRow())}
              placeholder={``}
              type="text"
              maxLength={34}
              className="form-control"
              required
              onKeyUp={e => {
                if (e.key === 'Enter') maybeAddNewRow();
              }}
            />
            <label htmlFor={`memo-${index}`}>Memo #{index + 1}</label>
          </div>
        </div>
      </div>
    </div>
  );
}
