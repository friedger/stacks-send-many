import React from 'react';
export function Address({ addr }) {
  return (
    <>
      {addr.substr(0, 5)}...{addr.substr(addr.length - 5)}
    </>
  );
}
