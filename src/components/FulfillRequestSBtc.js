import { useConnect as useStacksConnect } from '@stacks/connect-react';
import {
  ClarityType,
  FungibleConditionCode,
  PostConditionMode,
  createAssetInfo,
  cvToString,
  getContractMapEntry,
  makeContractFungiblePostCondition,
  principalCV,
  tupleCV,
  uintCV,
} from '@stacks/transactions';
import React, { useRef, useState } from 'react';
import { useConnect } from '../lib/auth';
import { NETWORK } from '../lib/constants';

export function FulfillRequestSBtc({ assetContract, ownerStxAddress, sendManyContractName }) {
  const spinner = useRef();
  const requestIdRef = useRef();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState();
  const { userSession } = useConnect();
  const { doContractCall } = useStacksConnect();

  const sendAction = async () => {
    setLoading(true);
    setStatus();
    const [contractAddress] = assetContract.split('.');
    const requestId = requestIdRef.current.value;

    const requestDetailsEntry = await getContractMapEntry({
      contractAddress,
      contractName: sendManyContractName,
      mapName: 'requests',
      mapKey: tupleCV({ owner: principalCV(ownerStxAddress), 'request-id': uintCV(requestId) }),
      network: NETWORK,
    });
    setStatus(cvToString(requestDetailsEntry));
    console.log(JSON.stringify(requestDetailsEntry));

    if (requestDetailsEntry.type === ClarityType.OptionalSome) {
      const total = requestDetailsEntry.value.list.reduce(
        (sum, { data }) => sum + Number(data['sbtc-in-sats'].value),
        0
      );
      console.log({ total });

      let options = {
        contractAddress,
        contractName: sendManyContractName,
        functionName: 'fulfill-send-request',
        functionArgs: [uintCV(requestId)],
        postConditions: [
          makeContractFungiblePostCondition(
            contractAddress,
            sendManyContractName,
            FungibleConditionCode.Equal,
            total,
            createAssetInfo(contractAddress, 'asset', 'sbtc')
          ),
        ],
      };

      const handleSendResult = data => {
        setStatus(data.txId);
      };

      options = {
        ...options,
        userSession,
        network: NETWORK,
        postConditionMode: PostConditionMode.Deny,
        onFinish: handleSendResult,
        onCancel: () => {
          setStatus('Transaction not sent.');
          setLoading(false);
        },
      };
      await doContractCall(options);
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
