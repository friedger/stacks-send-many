import React from 'react';
export function SendManyInput({ onKeyUp }) {
  return (
    <>
      <input onKeyUp={onKeyUp} placeholder="recipient"></input>
      <input onKeyUp={onKeyUp} placeholder="amount"></input>
      <input onKeyUp={onKeyUp} placeholder="memo"></input>
    </>
  );
}
