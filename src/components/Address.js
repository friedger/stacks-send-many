import React, { useEffect, useMemo, useState } from 'react';
import { callReadOnlyFunction, standardPrincipalCV, ClarityType } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';

function hex_to_ascii(bytes) {
  var str = '';
  for (var n = 0; n < bytes.length; n += 1) {
    str += String.fromCharCode(bytes[n]);
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
  return result;
};

const useResolveName = addr => {
  const addressShort = useMemo(() => `${addr.substr(0, 5)}...${addr.substr(addr.length - 5)}`, [
    addr,
  ]);

  const [nameOrAddress, setNameOrAddress] = useState(addressShort);
  useEffect(() => {
    getNameFromAddress(addr).then(data => {
      if (data.value.type === ClarityType.Tuple) {
        const { name, namespace } = data.value.data;
        const nameStr = hex_to_ascii(name.buffer).trim();
        const namespaceStr = hex_to_ascii(namespace.buffer).trim();
        setNameOrAddress(`${nameStr}.${namespaceStr}`);
      }
    });
  }, [addr]);
  return nameOrAddress;
};

export function Address({ addr }) {
  const nameOrAddress = useResolveName(addr);
  return <span title={nameOrAddress}>{nameOrAddress}</span>;
}
