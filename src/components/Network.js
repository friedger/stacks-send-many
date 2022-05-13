import React from 'react';
import { STACKS_API, isTestnet, isMainnet } from '../lib/stacks';

export function Network() {
  return (
    <div
      className={`rounded border-secondary d-flex justify-content-around my-1 px-2 ${
        isTestnet ? 'bg-primary' : 'bg-secondary'
      }`}
      title={STACKS_API}
    >
      {isMainnet ? 'mainnet' : isTestnet ? 'testnet' : 'mocknet'}
    </div>
  );
}
