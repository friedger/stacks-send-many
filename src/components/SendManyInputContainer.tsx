import {
  AuthType,
  bufferCVFromString,
  ClarityType,
  contractPrincipalCV,
  createAssetInfo,
  cvToString,
  FungibleConditionCode,
  listCV,
  makeStandardFungiblePostCondition,
  makeStandardSTXPostCondition,
  noneCV,
  PostConditionMode,
  principalCV,
  PrincipalCV,
  someCV,
  standardPrincipalCV,
  trueCV,
  tupleCV,
  TxBroadcastResult,
  uintCV,
} from '@stacks/transactions';
import React, { useEffect, useRef, useState } from 'react';

import {
  ContractCallOptions,
  FinishedTxData,
  useConnect as useStacksConnect,
} from '@stacks/connect-react';
import { StacksNetworkName } from '@stacks/network';
import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';
import { c32addressDecode } from 'c32check';
import toAscii from 'punycode2/to-ascii';
import { useSearchParams } from 'react-router-dom';
import { fetchAccount } from '../lib/account';
import { useConnect } from '../lib/auth';
import { chains, Contract, NETWORK, SUPPORTED_ASSETS, SupportedSymbols } from '../lib/constants';
import { getProvider } from '../lib/getProvider';
import { useWalletConnect } from '../lib/hooks';
import { getNameInfo } from '../lib/names';
import { saveTxData, TxStatus } from '../lib/transactions';
import { Address } from './Address';
import { Amount } from './Amount';
import { SendManyInput } from './SendManyInput';
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
          const owner = await getNameInfo(toAscii(p.to));
          if (owner.type === ClarityType.OptionalSome) {
            return { ...p, toCV: owner.value.data.owner };
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
  network,
}: {
  asset: SupportedSymbols;
  ownerStxAddress: string;
  assetId?: string;
  sendManyContract?: Contract;
  network: StacksNetworkName;
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
        ustx: Math.floor(parseFloat(r.stx) * Math.pow(10, SUPPORTED_ASSETS[asset].decimals)),
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
    const handleSave = (data: Pick<FinishedTxData, 'txId'> & Partial<FinishedTxData>) => {
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
    const handleSendResult = (data: Pick<FinishedTxData, 'txId'> & Partial<FinishedTxData>) => {
      console.log({ data });
      if (data.stacksTransaction?.auth.authType === AuthType.Sponsored) {
        setStatus('Sending tx to sponsor');
        const feesInTokens = asset === 'not' ? TX_FEE_IN_NOT : TX_FEE_IN_SBTC_SATS;
        const body = { tx: data.txRaw, feesInTokens, network: 'mainnet' };
        console.log(body);
        const host = 'https://sponsoring.friedger.workers.dev';
        fetch(`${host}/${asset}/v1/sponsor`, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'text/plain' },
        })
          .then(response => {
            if (!response.ok) {
              response
                .json()
                .then((error: { error: string }) => {
                  console.log(error);
                  setStatus(JSON.stringify(error.error));
                  setLoading(false);
                })
                .catch(e => {
                  console.log(e);
                  response
                    .text()
                    .then(t => {
                      console.log(t, response);
                      setStatus(`Response status: ${response.status}  ${t}`);
                      setLoading(false);
                    })
                    .catch(e => {
                      console.log(e);
                      setStatus(`Response status: ${response.status}`);
                      setLoading(false);
                    });
                });
            } else {
              response
                .json()
                .then(
                  ({
                    feeEstimate,
                    result,
                    txRaw,
                  }: {
                    feeEstimate: number;
                    result: TxBroadcastResult;
                    txRaw: string;
                  }) => {
                    console.log({ feeEstimate, result, txRaw });
                    handleSave({
                      txId: result.txid,
                      txRaw,
                    });
                  }
                );
            }
          })
          .catch(e => {
            console.log(e);
            setStatus(
              'Failed to pay fees in NOT and broadcast the tx, please contact web administrator.'
            );
            setLoading(false);
          });
      } else {
        handleSave(data);
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
        await doContractCall(options, getProvider());
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
    let options: ContractCallOptions | undefined = undefined;
    let contractAddress = undefined;
    let contractName = undefined;
    let assetInfo = undefined;
    console.log({ asset });
    switch (asset) {
      case 'stx':
        contractAddress = SUPPORTED_ASSETS.stx.sendManyContractsAddress?.[network];
        if (contractAddress) {
          options = {
            contractAddress: contractAddress,
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
        }
        break;
      case 'xbtc':
        assetInfo = SUPPORTED_ASSETS.xbtc.assets?.[network];
        if (assetInfo?.sendManyContract) {
          const [contractId, asset] = assetInfo.asset.split('::');
          const [contractAddress, contractName] = contractId.split('.');
          options = {
            contractAddress: assetInfo.sendManyContract.address,
            contractName: assetInfo.sendManyContract.name,
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
                createAssetInfo(contractAddress, contractName, asset)
              ),
            ],
          };
        }
        break;
      case 'sbtc':
        assetInfo = SUPPORTED_ASSETS[asset].assets?.[network];
        if (assetInfo) {
          const [contractId, assetName] = assetInfo.asset.split('::');
          const [address, name] = contractId.split('.');
          // use native function
          ({ address: contractAddress, name: contractName } = { address, name });

          options = {
            contractAddress: contractAddress,
            contractName: contractName,
            functionName: 'transfer-many',
            functionArgs: [
              listCV(
                nonEmptyParts.map(p => {
                  return tupleCV({
                    to: p.toCV!,
                    sender: principalCV(ownerStxAddress),
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
                createAssetInfo(address, name, assetName)
              ),
            ],
          };
        }
        break;
      default:
        assetInfo = SUPPORTED_ASSETS[asset].assets?.[network];
        if (assetInfo) {
          const [contractId, assetName] = assetInfo.asset.split('::');
          const [address, name] = contractId.split('.');
          if (assetInfo.sendManyContract) {
            // use send-many contract
            ({ address: contractAddress, name: contractName } = assetInfo.sendManyContract);
          } else {
            // use native function
            ({ address: contractAddress, name: contractName } = { address, name });
          }
          options = {
            contractAddress: contractAddress,
            contractName: contractName,
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
                createAssetInfo(address, name, assetName)
              ),
            ],
          };
        }
        break;
    }

    if (options) {
      if (useAssetForFees) {
        (options as any).sponsored = true;
        options.fee = 0;
      }
      sendAsset(options);
    } else {
      setStatus(`Send Many not supported for ${SUPPORTED_ASSETS[asset].shortName} on ${network}.`);
    }
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
  const TX_FEE_IN_NOT = '10000';
  const TX_FEE_IN_SBTC = '0.000001';
  const TX_FEE_IN_SBTC_SATS = '100';

  const cloneAndAddFees = (rows: Row[]) => {
    const newRows = new Array(...rows);
    newRows.push(feesRow(asset));
    return newRows;
  };

  const feesRow = (asset: string): Row => {
    if (asset === 'not') {
      return { to: NOT_SPONSOR, stx: TX_FEE_IN_NOT, memo: 'fees' };
    } else if (asset === 'sbtc') {
      return { to: NOT_SPONSOR, stx: TX_FEE_IN_SBTC, memo: 'fees' };
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
        {(asset === 'not' || asset === 'sbtc') && (
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
                Pay fees in {SUPPORTED_ASSETS[asset].shortName}?
              </label>
            </div>
          </div>
        )}

        <div>{preview}</div>
        {useAssetForFees && (
          <div>
            <small>The transaction fees are sponsored by {NOT_SPONSOR}</small>
          </div>
        )}
        <div className="input-group mt-2">
          <button className="btn btn-block btn-primary" type="button" onClick={sendAction}>
            <div
              ref={spinner}
              role="status"
              className={`${
                loading ? '' : 'd-none'
              } spinner-border spinner-border-sm text-info align-text-top mr-2`}
            />
            {namesResolved ? 'Send' : 'Preview'}
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
