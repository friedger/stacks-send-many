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

import { CONTRACT_ADDRESS, NETWORK, testnet } from '../lib/constants';
import { fetchAccount } from '../lib/account';
import { userSessionState } from '../lib/auth';
import { useStxAddresses } from '../lib/hooks';
import { useAtomValue } from 'jotai/utils';
import { useConnect } from '@stacks/connect-react';
import { saveTxData, TxStatus } from '../lib/transactions';
import { c32addressDecode } from 'c32check';
import BigNum from 'bn.js';
import { SendManyInput } from './SendManyInput';
import { Address } from './Address';
import { Amount } from './Amount';

export function SendManyButton() {
  const userSession = useAtomValue(userSessionState);
  const spinner = useRef();
  const [status, setStatus] = useState();
  const [account, setAccount] = useState();
  const [txId, setTxId] = useState();
  const [preview, setPreview] = useState();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([{ to: '', stx: '0', memo: '' }]);
  const { ownerStxAddress } = useStxAddresses(userSession);
  const { doContractCall } = useConnect();

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
    }
  }, [userSession, ownerStxAddress]);

  const updatePreview = async ({ parts, total }) => {
    setPreview(
      <>
        {parts.map(p => {
          try {
            c32addressDecode(p.to);
            return (
              <>
                <Address addr={p.to} />: <Amount ustx={p.ustx} /> <br />
              </>
            );
          } catch (e) {
            return (
              <>
                ...: <Amount ustx={p.ustx} />
                <br />
              </>
            );
          }
        })}{' '}
        Total: <Amount ustx={total} />
        <br />
        {total + 1000 > account.balance && (
          <>That is more than you have ({account.balance / 1000000})</>
        )}
      </>
    );
  };

  const getPartsFromRows = currentRows => {
    const parts = currentRows.map(r => {
      return { ...r, ustx: Math.floor(parseFloat(r.stx) * 1000000) };
    });
    const total = parts.reduce((sum, r) => (isNaN(r.ustx) ? sum : (sum += r.ustx)), 0);
    return { parts, total };
  };

  const sendAction = async () => {
    setLoading(true);
    const { parts, total } = getPartsFromRows(rows);
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

  const addNewRow = () => {
    const newRows = [...rows];
    newRows.push({ to: '', stx: '0', memo: '' });
    console.log(newRows);
    setRows(newRows);
  };

  const updateRow = (row, index) => {
    console.log({ row });
    const newRows = [...rows];
    newRows[index] = row;
    console.log(newRows);
    setRows(newRows);
    return newRows;
  };

  const updateModel = index => {
    return row => {
      const rows = updateRow(row, index);
      updatePreview(getPartsFromRows(rows));
    };
  };

  return (
    <div>
      Send {testnet ? 'Test' : ''} STXs
      <div className="NoteField">
           
        {rows.map((row, index) => {
          return (
            <SendManyInput key={index} row={row} index={index} updateModel={updateModel(index)} />
          );
        })} 
        <div className="row">
          <div className="col-md-12 col-xs-12 col-lg-12 text-right pb-2">
            <input  onClick={e => addNewRow()} type="button" value="Add New Field" class="btn btn-primary" id="addNewField"/>
            <br/>
          </div>
        </div>
        <br />
        <div>{preview}</div>
        <br />
        <div className="input-group">
          <button className="btn btn-primary" type="button" onClick={sendAction}>
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
