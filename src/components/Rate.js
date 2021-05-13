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
    <div className="rounded border-secondary d-flex justify-content-center bg-secondary">
      <small className="text-dark">Ӿ </small> ${stxUsd.value} {stxUsd.loading ? '...' : ''}
    </div>
  );
}
