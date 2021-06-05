import { ClarityType } from '@stacks/transactions';
import { useEffect, useState } from 'react';
import { getPoxInfo } from '../lib/citycoin';

export function PoxInfo() {
  const [poxInfo, setPoxInfo] = useState();
  useEffect(() => {
    getPoxInfo().then(info => setPoxInfo(info));
  }, []);
  return (
    <>
      {poxInfo && (
        <>
          {poxInfo.type === ClarityType.ResponseErr ? (
            <>City Coin not yet activated.</>
          ) : (
            <>{JSON.stringify(poxInfo.value)}</>
          )}
        </>
      )}
    </>
  );
}
