import React from 'react';

export function Address({ bns, addr }) {
  const address = bns.loaded
    ? bns.data
    : addr
    ? `${addr.substr(0, 5)}...${addr.substr(addr.length - 5)}`
    : 'Profile';
  return <span title={address}>{bns.loaded ? bns.data : address}</span>;
}
