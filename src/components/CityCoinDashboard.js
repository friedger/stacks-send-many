import React from 'react';
import { CityCoinTxList } from './CityCoinTxList';
import { CONTRACT_DEPLOYER, CITYCOIN_AUTH, NETWORK } from '../lib/constants';
import { AnchorMode, contractPrincipalCV } from '@stacks/transactions';
import { useConnect } from '@stacks/connect-react';

export function CityCoinDashboard() {
  const { doContractCall } = useConnect();
  const initializeContracts = async () => {
    const coreContractCV = contractPrincipalCV(
      'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27',
      'miamicoin-core-v1'
    );

    await doContractCall({
      contractAddress: CONTRACT_DEPLOYER,
      contractName: CITYCOIN_AUTH,
      functionName: 'initialize-contracts',
      functionArgs: [coreContractCV],
      anchorMode: AnchorMode.OnChainOnly,
      network: NETWORK,
    });
  };

  return (
    <>
      {/* <PoxLiteInfo /> <hr /> */}

      <CityCoinTxList />
      {/*
      <div>
        <p>Initialize Contracts</p>
        <button className="btn btn-block btn-primary" type="button" onClick={initializeContracts}>
          Go!
        </button>
      </div>
       */}
    </>
  );
}
