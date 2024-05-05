import { useConnect as useStacksConnect } from '@stacks/connect-react';
import {
  ClarityType,
  FungibleConditionCode,
  ListCV,
  PostConditionMode,
  TupleCV,
  UIntCV,
  callReadOnlyFunction,
  createAssetInfo,
  cvToString,
  makeContractFungiblePostCondition,
  principalCV,
  uintCV,
} from '@stacks/transactions';
import React, { useRef, useState } from 'react';
import { useConnect } from '../lib/auth';
import { NETWORK } from '../lib/constants';

export function FulfillRequestSBtc({
  assetContract,
  ownerStxAddress,
  sendManyContract,
}: {
  assetContract: string;
  ownerStxAddress: string;
  sendManyContract: string;
}) {
  const spinner = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>();
  const { userSession } = useConnect();
  const { doContractCall } = useStacksConnect();

  const [sendManyContractAddress, sendManyContractName] = sendManyContract.split('.');

  const sendAction = async () => {
    setLoading(true);
    setStatus(undefined);
    const [assetContractAddress, assetContractName] = assetContract.split('.');
    const requestId = requestIdRef.current!.value;

    const requestDetails = await callReadOnlyFunction({
      contractAddress: sendManyContractAddress,
      contractName: sendManyContractName,
      functionName: 'get-request',
      functionArgs: [principalCV(ownerStxAddress), uintCV(requestId)],
      senderAddress: ownerStxAddress,
      network: NETWORK,
    });
    setStatus(cvToString(requestDetails));
    console.log(JSON.stringify(requestDetails));

    if (requestDetails.type === ClarityType.OptionalSome) {
      const total = (
        requestDetails.value as ListCV<TupleCV<{ 'sbtc-in-sats': UIntCV }>>
      ).list.reduce((sum, { data }) => sum + Number(data['sbtc-in-sats'].value), 0);
      console.log({ total });

      let options = {
        contractAddress: sendManyContractAddress,
        contractName: sendManyContractName,
        functionName: 'fulfill-send-request',
        functionArgs: [uintCV(requestId)],
        postConditions: [
          makeContractFungiblePostCondition(
            sendManyContractAddress,
            sendManyContractName,
            FungibleConditionCode.Equal,
            total,
            createAssetInfo(assetContractAddress, assetContractName, 'sbtc')
          ),
        ],
      };

      await doContractCall({
        ...options,
        userSession,
        network: NETWORK,
        postConditionMode: PostConditionMode.Deny,
        onFinish: data => {
          setStatus(data.txId);
        },
        onCancel: () => {
          setStatus('Transaction not sent.');
          setLoading(false);
        },
      });
    }
    setLoading(false);
  };

  return (
    <div>
      <div>
        <div className="row">
          <div className="col-md-12 col-xs-12 col-lg-12 text-right pb-2">
            <input
              ref={requestIdRef}
              type="text"
              placeholder="request id"
              className="form-control"
            />
          </div>
        </div>
        <div className="input-group mt-2">
          <button className="btn btn-block btn-primary" type="button" onClick={sendAction}>
            <div
              ref={spinner}
              role="status"
              className={`${
                loading ? '' : 'd-none'
              } spinner-border spinner-border-sm text-info align-text-top mr-2`}
            />
            Distribute sBTC
          </button>
        </div>
      </div>
      {status && (
        <>
          <div>
            <small>{status}</small>
          </div>
        </>
      )}
    </div>
  );
}
