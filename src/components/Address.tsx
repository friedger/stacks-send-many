import { StacksMainnet } from '@stacks/network';
import {
  BufferCV,
  ClarityType,
  ResponseErrorCV,
  ResponseOkCV,
  TupleCV,
  callReadOnlyFunction,
  principalCV,
} from '@stacks/transactions';
import toUnicode from 'punycode2/to-unicode';
import { useEffect, useMemo, useState } from 'react';
import { BNS_CONTRACT_ADDRESS, BNS_CONTRACT_NAME } from '../lib/constants';
import { getNameFromAddress } from '../lib/names';

function hex_to_ascii(bytes: Uint8Array) {
  var str = '';
  for (var n = 0; n < bytes.length; n += 1) {
    str += String.fromCharCode(bytes[n]);
  }
  return str;
}

export function Address({ addr }: { addr: string }) {
  const addressShort = useMemo(
    () => `${addr.substring(0, 5)}...${addr.substring(addr.length - 5)}`,
    [addr]
  );

  const [nameOrAddress, setNameOrAddress] = useState(addressShort);
  const [nameAscii, setNameAscii] = useState<string>();
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
