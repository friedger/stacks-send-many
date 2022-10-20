import React, { useEffect, useMemo, useState } from 'react';
import {
  callReadOnlyFunction,
  standardPrincipalCV,
  ClarityType,
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import toUnicode from 'punycode2/to-unicode';

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

export function Address({ addr }) {
  const addressShort = useMemo(() => `${addr.substr(0, 5)}...${addr.substr(addr.length - 5)}`, [
    addr,
  ]);

  const [nameOrAddress, setNameOrAddress] = useState(addressShort);
  const [nameAscii, setNameAscii] = useState();
  const [showAscii, setShowAscii] = useState(false);

  useEffect(() => {
    getNameFromAddress(addr).then(data => {
      if (data.type === ClarityType.ResponseOk && data.value.type === ClarityType.Tuple) {
        const { name, namespace } = data.value.data;

        const nameStr = hex_to_ascii(name.buffer);
        const namePunycodeStr = toUnicode(nameStr);
        const namespaceStr = hex_to_ascii(namespace.buffer);
        setNameAscii(nameStr === namePunycodeStr ? undefined : `${nameStr}.${namespaceStr}`);
        setNameOrAddress(`${namePunycodeStr}.${namespaceStr}`);
      }
    });
  }, [addr]);

  return (
    <>
      {nameAscii ? (
        <span
          onClick={() => {
            setShowAscii(!showAscii);
          }}
          title={nameAscii}
        >
          {nameOrAddress} ⓘ
          {showAscii && (
            <>
              <br />
              {nameAscii}
            </>
          )}
        </span>
      ) : (
        <span title={nameOrAddress}>{nameOrAddress}</span>
      )}
    </>
  );
}
