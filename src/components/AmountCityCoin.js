import React, { useEffect, useState } from 'react';
import { getCityCoinBalance } from '../lib/citycoin';

export function AmountCityCoin() {
  const [cityCoinBalance, setCityCoinBalance] = useState();

  useEffect(() => {
    getCityCoinBalance()
      .then(result => {
        setCityCoinBalance(result);
      })
      .catch(e => {
        setCityCoinBalance(0);
        console.log(e);
      });
  }, []);

  return <span>{cityCoinBalance} &nbsp;$CITY</span>;
}
