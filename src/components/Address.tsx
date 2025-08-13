import { ClarityType } from '@stacks/transactions';
import toUnicode from 'punycode2/to-unicode';
import { useEffect, useMemo, useState } from 'react';
import { getNameFromAddress } from '../lib/names';

function hex_to_ascii(bytes: string) {
  var str = '';
  for (var n = 0; n < bytes.length; n += 1) {
    str += String.fromCharCode(bytes.charCodeAt(n));
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
        const { name, namespace } = data.value.value;

        const nameStr = hex_to_ascii(name.value);
        const namePunycodeStr = toUnicode(nameStr);
        const namespaceStr = hex_to_ascii(namespace.value);
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
