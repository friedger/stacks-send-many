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
  bufferCVFromString,
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
import { Address } from './Address';
import { Amount } from './Amount';

export function SendManyInputContainer() {
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

  const updatePreview = async ({ parts, total, hasMemos }) => {
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
        {hasMemos && (
          <>
            Sending with memos.
            <br />
          </>
        )}
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
    const { total, hasMemos } = parts.reduce(
      (previous, r) => {
        return {
          total: isNaN(r.ustx) ? previous.total : (previous.total += r.ustx),
          hasMemos: previous.hasMemos || r.memo,
        };
      },
      {
        total: 0,
        hasMemos: false,
      }
    );
    return { parts, total, hasMemos };
  };

  const sendAction = async () => {
    setLoading(true);
    const { parts, total, hasMemos } = getPartsFromRows(rows);
    const contractAddress = CONTRACT_ADDRESS;
    const contractName = hasMemos ? 'send-many-memo' : 'send-many';
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
          return hasMemos
            ? tupleCV({ to, ustx: uintCV(parseInt(p.ustx)), memo: bufferCVFromString(p.memo) })
            : tupleCV({ to, ustx: uintCV(parseInt(p.ustx)) });
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
    setRows(newRows);
  };

  const updateRow = (row, index) => {
    const newRows = [...rows];
    newRows[index] = row;
    setRows(newRows);
    return newRows;
  };

  const updateModel = index => {
    return row => {
      const rows = updateRow(row, index);
      updatePreview(getPartsFromRows(rows));
    };
  };

  const maybeAddNewRow = index => {
    return () => {
      if (index === rows.length - 1) {
        addNewRow();
      }
    };
  };

  return (
    <div>
      <div className="NoteField">
        {rows.map((row, index) => {
          return (
            <SendManyInput
              key={index}
              row={row}
              index={index}
              updateModel={updateModel(index)}
              maybeAddNewRow={maybeAddNewRow(index)}
              lastRow={index === rows.length - 1}
            />
          );
        })}
        <div className="row">
          <div className="col-md-12 col-xs-12 col-lg-12 text-right pb-2">
            <input
              onClick={e => addNewRow()}
              disabled={rows.length > 199}
              type="button"
              value="Add New Recipient"
              className="btn btn-dark"
              id="addNewField"
            />
          </div>
        </div>
        <div>{preview}</div>
        <div className="input-group mt-2">
          <button className="btn btn-block btn-primary" type="button" onClick={sendAction}>
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
        <TxStatus txId={txId} resultPrefix="Transfers executed " />
      </div>
      {status && (
        <>
          <div>{status}</div>
        </>
      )}
    </div>
  );
}
