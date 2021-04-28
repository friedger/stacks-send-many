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
      <div  className="row">
        <div className="col-md-5 col-xs-5 col-lg-5">
          <div className="form-label-group">
            <input ref={to} value={row.to} onChange={e => updateModel(getRow())} placeholder="Wallet Address #1" type="text" className="form-control" required="" autofocus=""/>
            <label for="inputEmail">Wallet Address #1</label>
          </div>
        </div>
        <div className="col-md-3 col-xs-3 col-lg-3">
          <div className="form-label-group">
            <input ref={memo} value={row.memo} onChange={e => updateModel(getRow())} placeholder="0" type="text" className="form-control" required="" autofocus=""/>
            <label for="inputEmail">Memo Tag #1</label>
          </div>
        </div>
        <div className="col-md-3 col-xs-3 col-lg-3">
          <div className="form-label-group">
            <input ref={stxValue} value={row.stx} onChange={e => updateModel(getRow())} placeholder="0" type="text" maxlength="10" className="form-control" required="" autofocus=""/>
            <label for="inputEmail">Amount #1</label>
          </div>
        </div> 
        <div className="col-md-1 col-xs-1 col-lg-1">
          <div className="form-label-group">
          <input type="button" class="removeField btn btn-danger btn-sm" value="X"/>
          </div>
        </div>
      </div> 
      </div> 
  );
}
