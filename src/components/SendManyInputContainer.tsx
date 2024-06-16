import {
  AuthType,
  bufferCVFromString,
  contractPrincipalCV,
  createAssetInfo,
  cvToString,
  FungibleConditionCode,
  listCV,
  makeStandardFungiblePostCondition,
  makeStandardSTXPostCondition,
  noneCV,
  PostConditionMode,
  PrincipalCV,
  someCV,
  standardPrincipalCV,
  trueCV,
  tupleCV,
  uintCV,
} from '@stacks/transactions';
import React, { useEffect, useRef, useState } from 'react';

import {
  ContractCallOptions,
  FinishedTxData,
  useConnect as useStacksConnect,
} from '@stacks/connect-react';
import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';
import { c32addressDecode } from 'c32check';
import toAscii from 'punycode2/to-ascii';
import { useSearchParams } from 'react-router-dom';
import { fetchAccount } from '../lib/account';
import { useConnect } from '../lib/auth';
import {
  chains,
  CONTRACT_ADDRESS,
  namesApi,
  NETWORK,
  NOT_CONTRACT,
  WMNO_CONTRACT,
  WRAPPED_BITCOIN_CONTRACT,
  XBTC_SEND_MANY_CONTRACT,
} from '../lib/constants';
import { useWalletConnect } from '../lib/hooks';
import { saveTxData, TxStatus } from '../lib/transactions';
import { Address } from './Address';
import { Amount } from './Amount';
import { SendManyInput } from './SendManyInput';
import { Network } from './Network';
export type Row = {
  to: string;
  stx: string;
  memo?: string;
  error?: string;
  toCV?: PrincipalCV;
};
const addrToCV = (addr: string) => {
  const toParts = addr.split('.');
  if (toParts.length === 1) {
    return standardPrincipalCV(toParts[0]);
  } else {
    return contractPrincipalCV(toParts[0], toParts[1]);
  }
};

const addToCVValues = async <T extends Row>(parts: T[]) => {
  return Promise.all(
    parts.map(async p => {
      if (p.to === '') {
        return p;
      }
      try {
        return { ...p, toCV: addrToCV(p.to) };
      } catch (e) {
        try {
          const nameInfo = await namesApi.getNameInfo({ name: toAscii(p.to) });
          if (nameInfo.address) {
            return { ...p, toCV: addrToCV(nameInfo.address) };
          } else {
            return { ...p, error: `No address for ${p.to}` };
          }
        } catch (e2) {
          return { ...p, error: `${p.to} not found` };
        }
      }
    })
  );
};

function nonEmptyPart(p: Row) {
  return !!p.toCV && p.stx !== '0' && p.stx !== '';
}

export function SendManyInputContainer({
  asset,
  ownerStxAddress,
  assetId,
  sendManyContract,
}: {
  asset: string;
  ownerStxAddress: string;
  assetId?: string;
  sendManyContract: string;
}) {
  const { userSession } = useConnect();
  const { doContractCall } = useStacksConnect();
  const { wcClient, wcSession } = useWalletConnect();

  const spinner = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<string>();
  const [account, setAccount] = useState<AddressBalanceResponse>();
  const [txId, setTxId] = useState<string>();
  const [preview, setPreview] = useState<React.ReactNode>();
  const [loading, setLoading] = useState(false);
  const [namesResolved, setNamesResolved] = useState(true);
  const [firstMemoForAll, setFirstMemoForAll] = useState(false);
  const [useAssetForFees, setUseAssetsForFees] = useState(false);
  const [uriSearchParams, setUriSearchParams] = useSearchParams();

  useEffect(() => {
    const params = uriSearchParams.getAll('recipient');
    if (!params.length) {
      return;
    }
    const rows = params.map((item: string) => {
      const { amount, recipient, memo } =
        /(?<recipient>[^,]+),(?<amount>[0-9]+),?(?<memo>".*")?/.exec(item)?.groups as {
          recipient: string;
          amount: string;
          memo?: string;
        };
      return {
        to: recipient,
        stx: amount,
        memo: memo ? memo.replace(/\"/g, '') : '',
      } as Row;
    });

    if (rows.length) {
      setRows(rows);
      setUriSearchParams([]);
    }
  }, [uriSearchParams]);

  const [rows, setRows] = useState<Row[]>([{ to: '', stx: '0', memo: '' }]);

  useEffect(() => {
    if (ownerStxAddress) {
      fetchAccount(ownerStxAddress)
        .then(async acc => {
          setAccount(acc);
          console.log({ acc });
        })
        .catch((e: Error) => {
          setStatus('Failed to access your account');
          console.log(e);
        });
    }
  }, [ownerStxAddress]);

  const updatePreview = async ({ parts, total, hasMemos }: ReturnType<typeof getPartsFromRows>) => {
    setPreview(
      <>
        {parts.map(p => {
          try {
            c32addressDecode(p.to);
            return (
              <>
                <Address addr={p.to} />: <Amount amount={p.ustx} asset={asset} /> <br />
              </>
            );
          } catch (e) {
            setNamesResolved(!!p.toCV);
            return (
              <>
                {p.error || (p.toCV ? <Address addr={cvToString(p.toCV)} /> : '...')}:{' '}
                <Amount amount={p.ustx} asset={asset} /> <br />
                <br />
              </>
            );
          }
        })}{' '}
        Total: <Amount amount={total} asset={asset} /> <br />
        <br />
        {hasMemos && (
          <>
            Sending with memos.
            <br />
          </>
        )}
        {account && (
          <>
            {asset === 'stx' &&
              total + 1000 > parseInt(account.stx.balance) - parseInt(account.stx.locked) && (
                <small>
                  That is more than you have. You have{' '}
                  <Amount asset="stx" amount={+account.stx.balance - +account.stx.locked} />{' '}
                  (unlocked).
                </small>
              )}
            {/* Asset id is only undefined in stx */}
            {asset !== 'stx' && total > +(account.fungible_tokens?.[assetId!]?.balance || 0) && (
              <small>
                That is more than you have. You have{' '}
                <Amount
                  asset={asset}
                  amount={+(account.fungible_tokens?.[assetId!]?.balance || 0)}
                />
              </small>
            )}
          </>
        )}
      </>
    );
  };

  const getPartsFromRows = (currentRows: Row[]) => {
    const parts = currentRows.map(r => {
      return {
        ...r,
        ustx: Math.floor(
          parseFloat(r.stx) *
            (asset === 'stx' ? 1_000_000 : asset === 'wmno' || asset === 'not' ? 1 : 100_000_000)
        ),
      };
    });

    const { total, hasMemos } = parts
      .filter(part => !isNaN(part.ustx))
      .reduce(
        (previous, r) => {
          return {
            total: previous.total + r.ustx,
            hasMemos: previous.hasMemos || Boolean(r.memo),
          };
        },
        {
          total: 0,
          hasMemos: false,
        }
      );
    return { parts, total, hasMemos };
  };

  const sendAsset = async (options: ContractCallOptions) => {
    const handleSendResult = (data: Pick<FinishedTxData, 'txId'> & Partial<FinishedTxData>) => {
      console.log({ data });
      if (data.stacksTransaction?.auth.authType === AuthType.Sponsored) {
        fetch('https://sponsoring.friedger.workers.dev/not', {
          method: 'POST',
          body: JSON.stringify({ txHex: data.txRaw, feesInNot: TX_FEE_IN_NOT, network: 'mainnet' }),
          headers: { 'Content-Type': 'text/plain' },
        })
          .then(r => console.log({ r }))
          .catch(e => console.log(e));
      }
      setStatus('Saving transaction to your storage');
      setTxId(data.txId);
      if (userSession) {
        saveTxData(data, userSession)
          .then(r => {
            setRows([{ to: '', stx: '0', memo: '' }]);
            setPreview(null);
            setLoading(false);
            setStatus(undefined);
          })
          .catch(e => {
            console.log(e);
            setLoading(false);
            setStatus("Couldn't save the transaction");
          });
      }
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
    } as ContractCallOptions;
    try {
      setStatus(`Sending transaction`);
      if (wcSession) {
        setStatus('Waiting for confirmation on wallet');
        const result = await wcClient?.request({
          chainId: chains[0],
          topic: wcSession.topic,
          request: {
            method: 'stacks_contractCall',
            params: {
              pubkey: ownerStxAddress,
              contractAddress: options.contractAddress,
              contractName: options.contractName,
              functionName: options.functionName,
              functionArgs: options.functionArgs,
              postConditions: options.postConditions,
              postConditionMode: PostConditionMode.Deny,
              version: '1',
            },
          },
        });
        console.log('result', { result });
        handleSendResult({ txId: result as string });
      } else {
        console.log({ sponsored: options.sponsored });
        await doContractCall(options);
      }
    } catch (e) {
      console.log(e);
      setStatus((e as Error).toString());
      setLoading(false);
    }
  };

  const sendAction = async () => {
    setLoading(true);
    setStatus(undefined);

    let { parts, total, hasMemos } = getPartsFromRows(
      useAssetForFees ? cloneAndAddFees(rows) : rows
    );
    const updatedParts = await addToCVValues(parts);
    let invalidNames = updatedParts.filter(r => !!r.error);
    if (invalidNames.length > 0) {
      updatePreview({ parts: updatedParts, total, hasMemos });
      setLoading(false);
      setStatus('Please verify receivers');
      return;
    }
    if (!namesResolved) {
      updatePreview({ parts: updatedParts, total, hasMemos });
      setLoading(false);
      setNamesResolved(true);
      return;
    }
    const nonEmptyParts = updatedParts.filter(nonEmptyPart);
    console.log(nonEmptyParts[0]);
    const firstMemo =
      nonEmptyParts.length > 0 && nonEmptyParts[0].memo ? nonEmptyParts[0].memo.trim() : '';
    let options: ContractCallOptions;
    let contractAddress, contractName;
    switch (asset) {
      case 'stx':
        options = {
          contractAddress: CONTRACT_ADDRESS,
          contractName: hasMemos ? 'send-many-memo' : 'send-many',
          functionName: 'send-many',
          functionArgs: [
            listCV(
              nonEmptyParts.map(p => {
                return hasMemos
                  ? tupleCV({
                      to: p.toCV!,
                      ustx: uintCV(p.ustx),
                      memo: bufferCVFromString(
                        firstMemoForAll ? firstMemo : p.memo ? p.memo.trim() : ''
                      ),
                    })
                  : tupleCV({ to: p.toCV!, ustx: uintCV(p.ustx) });
              })
            ),
          ],
          postConditions: [
            makeStandardSTXPostCondition(ownerStxAddress, FungibleConditionCode.Equal, total),
          ],
        };
        break;
      case 'sbtc':
        [contractAddress, contractName] = sendManyContract.split('.');
        options = {
          contractAddress,
          contractName,
          functionName: 'request-send-sbtc-many',
          functionArgs: [
            listCV(
              nonEmptyParts.map(p => {
                return tupleCV({
                  to: p.toCV!,
                  'sbtc-in-sats': uintCV(p.ustx),
                  memo: bufferCVFromString(
                    hasMemos ? (firstMemoForAll ? firstMemo : p.memo ? p.memo.trim() : '') : ''
                  ),
                });
              })
            ),
          ],
          postConditions: [],
        };
        break;
      case 'wmno':
        options = {
          contractAddress: WMNO_CONTRACT.address,
          contractName: WMNO_CONTRACT.name,
          functionName: 'send-many',
          functionArgs: [
            listCV(
              nonEmptyParts.map(p => {
                return tupleCV({
                  to: p.toCV!,
                  amount: uintCV(p.ustx),
                });
              })
            ),
          ],
          postConditions: [
            makeStandardFungiblePostCondition(
              ownerStxAddress,
              FungibleConditionCode.Equal,
              total,
              createAssetInfo(WMNO_CONTRACT.address, WMNO_CONTRACT.name, WMNO_CONTRACT.asset)
            ),
          ],
        };
        break;
      case 'not':
        options = {
          contractAddress: NOT_CONTRACT.address,
          contractName: NOT_CONTRACT.name,
          functionName: 'send-many',
          functionArgs: [
            listCV(
              nonEmptyParts.map(p => {
                return tupleCV({
                  to: p.toCV!,
                  amount: uintCV(p.ustx),
                  memo: hasMemos
                    ? firstMemoForAll
                      ? someCV(bufferCVFromString(firstMemo))
                      : p.memo
                        ? someCV(bufferCVFromString(p.memo.trim()))
                        : noneCV()
                    : noneCV(),
                });
              })
            ),
          ],
          postConditions: [
            makeStandardFungiblePostCondition(
              ownerStxAddress,
              FungibleConditionCode.Equal,
              total,
              createAssetInfo(NOT_CONTRACT.address, NOT_CONTRACT.name, NOT_CONTRACT.asset)
            ),
          ],
        };
        break;
      default:
        options = {
          contractAddress: XBTC_SEND_MANY_CONTRACT.address,
          contractName: XBTC_SEND_MANY_CONTRACT.name,
          functionName: 'send-xbtc',
          functionArgs: [
            nonEmptyParts.map(p => {
              return tupleCV({
                to: p.toCV!,
                'xbtc-in-sats': uintCV(p.ustx),
                memo: bufferCVFromString(
                  hasMemos ? (firstMemoForAll ? firstMemo : p.memo ? p.memo.trim() : '') : ''
                ),
                'swap-to-ustx': trueCV(),
                'min-dy': noneCV(),
              });
            })[0],
          ],
          postConditions: [
            makeStandardFungiblePostCondition(
              ownerStxAddress,
              FungibleConditionCode.Equal,
              total,
              createAssetInfo(
                WRAPPED_BITCOIN_CONTRACT.address,
                WRAPPED_BITCOIN_CONTRACT.name,
                WRAPPED_BITCOIN_CONTRACT.asset
              )
            ),
          ],
        };
        break;
    }

    if (useAssetForFees) {
      (options as any).sponsored = true;
      options.fee = 0;
    }

    sendAsset(options);
  };

  const addNewRow = () => {
    const newRows = [...rows];
    newRows.push({ to: '', stx: '0', memo: '' });
    setRows(newRows);
  };

  const updateRow = (row: Row, index: number) => {
    const newRows = [...rows];
    newRows[index] = row;
    setRows(newRows);
    return newRows;
  };

  const NOT_SPONSOR = 'SPM1NE6JPN9V1019930579E7EZ58FYKMD17J7RS';
  const TX_FEE_IN_NOT = '100000';

  const cloneAndAddFees = (rows: Row[]) => {
    const newRows = new Array(...rows);
    newRows.push(feesRow(asset));
    return newRows;
  };

  const feesRow = (asset: string): Row => {
    if (asset === 'not') {
      return { to: NOT_SPONSOR, stx: TX_FEE_IN_NOT, memo: 'fees' };
    } else {
      throw new Error(`unsupported asset ${asset}`);
    }
  };
  const updateModel = (index: number, useAssetForFees: boolean) => {
    return (row: Row) => {
      let rows = updateRow(row, index);
      if (useAssetForFees) {
        rows = cloneAndAddFees(rows);
      }
      updatePreview(getPartsFromRows(rows));
    };
  };

  const maybeAddNewRow = (index: number) => {
    return () => {
      if (index === rows.length - 1) {
        addNewRow();
      }
    };
  };

  const handleOnPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const entries = e.clipboardData
      .getData('Text')
      .split('\n')
      .map(entry => entry.split(','))
      .map(entryParts => {
        return {
          to: entryParts[0].trim().replace(/-([^-]*)$/, '.$1'),
          stx: entryParts[1].trim(),
          memo: entryParts.length > 2 ? entryParts[2].trim() : undefined,
        };
      });
    const newRows = [...entries];
    setRows(newRows);
  };

  return (
    <div>
      <div>
        {rows.map((row, index) => {
          return (
            <SendManyInput
              key={index}
              row={row}
              index={index}
              updateModel={updateModel(index, useAssetForFees)}
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
        <div className="row">
          <div className="col-md-12 col-xs-12 col-lg-12 text-right pb-2">
            <input
              onPaste={handleOnPaste}
              type="text"
              placeholder="Paste entry list"
              className="form-control"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-xs-12 col-lg-12 text-right pb-2">
            <input
              className="form-check-input"
              type="checkbox"
              onChange={e => setFirstMemoForAll(e.target.checked)}
              id="firstMemoForAll"
              checked={firstMemoForAll}
            />
            <label className="form-check-label" htmlFor="firstMemoForAll">
              First Memo for all?
            </label>
          </div>
        </div>
        {asset === 'not' && (
          <div className="row">
            <div className="col-md-12 col-xs-12 col-lg-12 text-right pb-2">
              <input
                className="form-check-input"
                type="checkbox"
                onChange={e => {
                  setUseAssetsForFees(e.target.checked);
                  updateModel(0, e.target.checked)(rows[0]);
                }}
                id="useAssetForFees"
                checked={useAssetForFees}
              />
              <label className="form-check-label" htmlFor="useAssetForFees">
                Pay fees in NOT
              </label>
            </div>
          </div>
        )}

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
            {namesResolved ? (asset === 'sbtc' ? 'Store request' : 'Send') : 'Preview'}
          </button>
        </div>
      </div>
      <div>
        <TxStatus txId={txId} resultPrefix="Transfers executed? " />
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
