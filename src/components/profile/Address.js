import React from 'react';

export function Address({ bns, addr }) {
  const address = bns.loaded
    ? bns.data
    : addr.loaded
    ? `${addr.data.substr(0, 5)}...${addr.data.substr(addr.data.length - 5)}`
    : 'Profile';
  return <span title={address}>{bns.loaded ? bns.data : address}</span>;
}
