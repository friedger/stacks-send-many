import { useConnect } from '@stacks/connect-react';
import {
  createAssetInfo,
  FungibleConditionCode,
  makeStandardFungiblePostCondition,
  PostConditionMode,
  uintCV,
} from '@stacks/transactions';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { fromMicro, STACKS_NETWORK } from '../../lib/stacks';
import { CITY_CONFIG } from '../../store/cities';
import { stxAddressAtom } from '../../store/stacks';
import LinkTx from '../common/LinkTx';

export default function CityCoinBalance({ balances, symbol, version }) {
  const { doContractCall } = useConnect();
  const [stxAddress] = useAtom(stxAddressAtom);
  const [submitted, setSubmitted] = useState(false);
  const [txId, setTxId] = useState(undefined);

  const convertCityCoins = async () => {
    const balance = balances.data[symbol][version];
    const amountCityCoinsCV = uintCV(balance);

    let postConditions = [];
    balance > 0 &&
      postConditions.push(
        makeStandardFungiblePostCondition(
          stxAddress.data,
          FungibleConditionCode.Equal,
          amountCityCoinsCV.value,
          createAssetInfo(
            CITY_CONFIG[symbol][version].deployer,
            CITY_CONFIG[symbol][version].token.name,
            CITY_CONFIG[symbol][version].token.tokenName
          )
        )
      );
    await doContractCall({
      contractAddress: CITY_CONFIG[symbol]['v2'].deployer,
      contractName: CITY_CONFIG[symbol]['v2'].token.name,
      functionName: 'convert-to-v2',
      functionArgs: [],
      postConditionMode: PostConditionMode.Deny,
      postConditions: postConditions,
      network: STACKS_NETWORK,
      onCancel: () => {
        setSubmitted(false);
        setTxId(undefined);
      },
      onFinish: result => {
        setSubmitted(true);
        setTxId(result.txId);
      },
    });
  };

  return (
    <div className="row align-items-center">
      <div className="col-4 text-nowrap text-right">
        {version === 'v2'
          ? fromMicro(balances.data[symbol][version]).toLocaleString()
          : balances.data[symbol][version].toLocaleString()}
      </div>
      <div className="col-4 text-center">
        {symbol.toUpperCase()} ({version})
      </div>
      <div className="col-4 text-center">
        {version === 'v1' &&
          (submitted && txId ? (
            <small>
              <LinkTx className="m-3" txId={txId} />
            </small>
          ) : (
            <button
              className="btn btn-sm btn-outline-primary"
              title={`Convert V1 ${symbol.toUpperCase()} to V2 ${symbol.toUpperCase()}`}
              onClick={convertCityCoins}
              disabled={submitted}
            >
              Convert
            </button>
          ))}
      </div>
    </div>
  );
}
