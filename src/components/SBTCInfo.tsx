import { callReadOnlyFunction, cvToString, PrincipalCV, TupleCV } from '@stacks/transactions';
import { useEffect, useState } from 'react';
import { NETWORK } from '../lib/constants';

export function SBTCInfo({ assetId }: { assetId: string }) {
  const [info, setInfo] = useState<string>();
  // fetch current signer data
  useEffect(() => {
    const fn = async () => {
      const [contractId, _] = assetId.split('::');
      const [contractAddress, contractName] = contractId.split('.');
      const response = (await callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-current-signer-data',
        functionArgs: [],
        senderAddress: contractAddress,
        network: NETWORK,
      })) as TupleCV<{ currentSigner: PrincipalCV }>;
      setInfo(`Current signer info: ${cvToString(response)}`);
    };
    fn().catch(e => {
      setInfo(`Failed to load signer data. (${e.message})`);
      console.info(e);
    });
  }, [assetId]);

  if (info) {
    return <p>{info}</p>;
  } else {
    return <p>Loading sBTC info..</p>;
  }
}
