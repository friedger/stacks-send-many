import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { refreshPrice, STX_USD } from '../lib/price';

export function Rate() {
  const [stxUsd, setStxUsd] = useAtom(STX_USD);

  useEffect(() => {
    refreshPrice(setStxUsd);
  }, [setStxUsd]);

  console.log(stxUsd);
  return (
    <div className="rounded border-secondary d-flex justify-content-around bg-secondary">
      <img src="stacks.png" width="25" height="25"/>
      <span>=</span>
       ${stxUsd.value} {stxUsd.loading ? '...' : ''}
    </div>
  );
}
