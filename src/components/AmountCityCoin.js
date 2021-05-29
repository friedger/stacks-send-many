import React, { useEffect, useState } from 'react';
import { getCityCoinBalance } from '../lib/citycoin';

export function AmountCityCoin({ stxAddress }) {
  const [cityCoinBalance, setCityCoinBalance] = useState();

  useEffect(() => {
    getCityCoinBalance(stxAddress)
      .then(result => {
        setCityCoinBalance(result);
      })
      .catch(e => {
        setCityCoinBalance(0);
        console.log(e);
      });
  }, [stxAddress]);

  return <span>{cityCoinBalance} &nbsp;$CITY</span>;
}
