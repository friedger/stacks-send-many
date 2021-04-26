import React, { useRef, useState, useEffect } from 'react';
import {
  listCV,
  tupleCV,
  standardPrincipalCV,
  contractPrincipalCV,
  uintCV,
  PostConditionMode,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
} from '@stacks/transactions';

import { CONTRACT_ADDRESS, NETWORK } from '../lib/constants';
import { fetchAccount } from '../lib/account';
import { userSessionState } from '../lib/auth';
import { useStxAddresses } from '../lib/hooks';
import { useAtomValue } from 'jotai/utils';
import { useConnect } from '@stacks/connect-react';
import { saveTxData, TxStatus } from '../lib/transactions';
import { c32addressDecode } from 'c32check';
import BigNum from 'bn.js';
import { SendManyInput } from './SendManyInput';

const addRows = (index, onKeyUp) => {
  return <SendManyInput key={index} onKeyUp={onKeyUp} />;
};

export function SendManyButton() {
  const userSession = useAtomValue(userSessionState);
  const textfield = useRef();
  const spinner = useRef();
  const [status, setStatus] = useState();
  const [account, setAccount] = useState();
  const [txId, setTxId] = useState();
  const [preview, setPreview] = useState();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState();
  const { ownerStxAddress } = useStxAddresses(userSession);
  const { doContractCall } = useConnect();

  const updatePreview = async () => {
    const { parts, total } = getParts();
    setPreview(
      <>
        {parts.map(p => {
          try {
            c32addressDecode(p.to);
            return (
              <>
                {p.to}: {p.ustx / 1000000}STX <br />
              </>
            );
          } catch (e) {
            return (
              <>
                ...: {p.ustx / 1000000}STX
                <br />
              </>
            );
          }
        })}{' '}
        Total: {total / 1000000}
        <br />
        {total + 1000 > account.balance && (
          <>That is more than you have ({account.balance / 1000000})</>
        )}
      </>
    );
  };

  useEffect(() => {
    if (userSession?.isUserSignedIn() && ownerStxAddress) {
      fetchAccount(ownerStxAddress)
        .catch(e => {
          setStatus('Failed to access your account', e);
          console.log(e);
        })
        .then(async acc => {
          setAccount(acc);
          console.log({ acc });
        });
      // FIXME: dynamically add SendManyInput with model
      //setRows([addRows(0, updatePreview), addRows(1, updatePreview)]);
    }
  }, [userSession, ownerStxAddress]);

  const getParts = () => {
    let parts = textfield.current.value.split('\n');
    parts = parts.map(s => {
      const lineParts = s.split(';').map(lp => lp.trim());
      return { to: lineParts[0], ustx: Math.floor(parseFloat(lineParts[1]) * 1000000) };
    });
    console.log({ parts });
    parts = parts.filter(p => p.to && p.ustx > 0);
    console.log({ parts });
    const total = parts.reduce((sum, p) => (sum += p.ustx), 0);
    console.log({ parts, total });
    return { parts, total };
  };

  const sendAction = async () => {
    setLoading(true);
    const { parts, total } = getParts();
    const contractAddress = CONTRACT_ADDRESS;
    const contractName = 'send-many';
    const functionName = 'send-many';
    const functionArgs = [
      listCV(
        parts.map(p => {
          const toParts = p.to.split('.');
          let to;
          if (toParts.length === 1) {
            to = standardPrincipalCV(toParts[0]);
          } else {
            to = contractPrincipalCV(toParts[0], toParts[1]);
          }
          return tupleCV({ to, ustx: uintCV(parseInt(p.ustx)) });
        })
      ),
    ];
    try {
      await doContractCall({
        contractAddress,
        contractName,
        functionName,
        functionArgs,
        network: NETWORK,
        postConditionMode: PostConditionMode.Deny,
        postConditions: [
          makeStandardSTXPostCondition(
            ownerStxAddress,
            FungibleConditionCode.Equal,
            new BigNum(total)
          ),
        ],
        finished: data => {
          console.log(data);
          setStatus(undefined);
          setTxId(data.txId);
          saveTxData(data, userSession)
            .then(r => {
              setLoading(false);
            })
            .catch(e => {
              console.log(e);
            });
        },
      });
      setStatus(`Sending transaction`);
    } catch (e) {
      console.log(e);
      setStatus(e.toString());
      setLoading(true);
    }
  };

  return (
    <div>
      Send Test STXs
      <div className="NoteField">
        {addRows(0, updatePreview)}
        <textarea
          type="text"
          ref={textfield}
          className="form-control"
          defaultValue={''}
          disabled={!account}
          onKeyUp={updatePreview}
          onBlur={e => {
            setStatus(undefined);
          }}
        />
        <br />
        <div>{preview}</div>
        <br />
        <div className="input-group">
          <button className="btn btn-outline-secondary" type="button" onClick={sendAction}>
            <div
              ref={spinner}
              role="status"
              className={`${
                loading ? '' : 'd-none'
              } spinner-border spinner-border-sm text-info align-text-top mr-2`}
            />
            Send
          </button>
        </div>
      </div>
      <div>
        <TxStatus txId={txId} resultPrefix="Offer placed in block " />
      </div>
      {status && (
        <>
          <div>{status}</div>
        </>
      )}
    </div>
  );
}
