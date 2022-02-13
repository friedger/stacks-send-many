import React, { useEffect, useMemo, useState } from 'react';
import {
  callReadOnlyFunction,
  standardPrincipalCV,
  cvToJSON,
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';

function hex_to_ascii(str1) {
  var hex = str1.toString();
  var str = '';
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

const getNameFromAddress = async addr => {
  const result = await callReadOnlyFunction({
    contractAddress: 'SP000000000000000000002Q6VF78',
    contractName: 'bns',
    functionName: 'resolve-principal',
    functionArgs: [standardPrincipalCV(addr)],
    senderAddress: addr,
    network: new StacksMainnet(),
  });
  return cvToJSON(result);
};

const useResolveName = addr => {
  const addressShort = useMemo(() => `${addr.substr(0, 5)}...${addr.substr(addr.length - 5)}`, [
    addr,
  ]);

  const [nameOrAddress, setNameOrAddress] = useState(addressShort);
  useEffect(() => {
    getNameFromAddress(addr).then(data => {
      if (!data.value.value.code) {
        const { name, namespace } = data.value.value;
        const nameStr = hex_to_ascii(name.value).trim();
        const namespaceStr = hex_to_ascii(namespace.value).trim();
        console.log(nameStr, namespaceStr)
        setNameOrAddress(`${nameStr}.${namespaceStr}`);
      }
    });
  }, [addr]);
  return nameOrAddress;
};

export function Address({ addr }) {
  const nameOrAddress = useResolveName(addr)
  return <span title={nameOrAddress}>{nameOrAddress}</span>;
}