import { callReadOnlyFunction, cvToString, PrincipalCV, TupleCV } from '@stacks/transactions';
import { useEffect, useState } from 'react';
import { NETWORK } from '../lib/constants';

export function SBTCInfo({ assetId }: { assetId: string }) {
  const [info, setInfo] = useState<string>();
  // fetch current signer data
  useEffect(() => {
    const fn = async () => {
      const [contractId, _] = assetId.split('::');
      const [contractAddress] = contractId.split('.');
      const response = (await callReadOnlyFunction({
        contractAddress,
        contractName: 'sbtc-registry',
        functionName: 'get-current-signer-data',
        functionArgs: [],
        senderAddress: contractAddress,
        network: NETWORK,
      })) as TupleCV<{ 'current-signer-principal': PrincipalCV }>;
      setInfo(
        `Current sBTC signer Stacks address: ${cvToString(response.data['current-signer-principal'])}`
      );
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
