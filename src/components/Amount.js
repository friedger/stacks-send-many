import React from 'react';

export function Amount({ ustx }) {
  if(isNaN(ustx)) {
    return ustx
  }
  return (
    <>
      {' '}
      {(ustx / 1000000).toLocaleString(undefined, {
        style: 'decimal',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6,
      })}
      Ӿ
    </>
  );
}
