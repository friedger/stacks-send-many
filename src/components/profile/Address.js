import React from 'react';
export function Address({ addr }) {
  const address = addr ? `${addr.substr(0, 5)}...${addr.substr(addr.length - 5)}` : 'Profile';
  return <span title={address}>{address}</span>;
}
