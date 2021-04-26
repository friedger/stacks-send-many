import React from 'react';
export function SendManyInput({ onKeyUp, key }) {
  return (
    <div key={key}>
      <input onKeyUp={onKeyUp} placeholder="recipient"></input>
      <input onKeyUp={onKeyUp} placeholder="amount"></input>
      <input onKeyUp={onKeyUp} placeholder="memo"></input>
    </div>
  );
}
