import React, { useRef } from 'react';
export function SendManyInput({ index, row, updateModel }) {
  const to = useRef();
  const stxValue = useRef();
  const memo = useRef();

  const getRow = () => {
    const value = {
      to: to.current.value.trim(),
      stx: stxValue.current.value.trim(),
      memo: memo.current.value.trim(),
    };
    return value;
  };

  return (
    <div key={index}>
      <input
        ref={to}
        value={row.to}
        onChange={e => updateModel(getRow())}
        placeholder="recipient"
      ></input>
      <input
        ref={stxValue}
        value={row.stx}
        onChange={e => updateModel(getRow())}
        placeholder="amount"
      ></input>
      <input
        ref={memo}
        value={row.memo}
        onChange={e => updateModel(getRow())}
        placeholder="memo"
      ></input>
    </div>
  );
}
