import * as btc from '@scure/btc-signer';
import { bytesToHex, hexToBytes } from '@stacks/common';
import {
  ClarityType,
  cvToString,
  getContractMapEntry,
  principalCV,
  tupleCV,
  uintCV,
} from '@stacks/transactions';
import React, { useRef, useState } from 'react';
import { DevEnvHelper, TestnetHelper, WALLET_00, sbtcDepositHelper } from 'sbtc';
import { useConnect } from '../lib/auth';
import { NETWORK, mocknet } from '../lib/constants';

export function DepositBtc({ assetContract, ownerStxAddress, sendManyContractName }) {
  const spinner = useRef();
  const requestIdRef = useRef();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState();
  const { userSession } = useConnect();

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

      const userData = userSession.loadUserData();
      let profile = userData.profile;
      let helper = new TestnetHelper();
      let sbtcWalletAddress = 'TODO';
      if (mocknet) {
        console.log('Using mocknet');
        helper = new DevEnvHelper();
        const btcAccount = await helper.getBitcoinAccount(WALLET_00);
        profile = {
          btcAddress: { p2wpkh: { testnet: btcAccount.wpkh.address } },
          btcPublicKey: { p2wpkh: btcAccount.publicKey.buffer.toString() },
        };

        const sbtcWalletAccount = await helper.getBitcoinAccount(WALLET_00);
        sbtcWalletAddress = sbtcWalletAccount.tr.address;
      }
      const btcAddress = profile.btcAddress.p2wpkh.testnet;
      const btcPublicKey = userData.profile.btcPublicKey.p2wpkh;
      console.log({ btcAddress, btcPublicKey });

      let utxos = await helper.fetchUtxos(btcAddress);

      const tx = await sbtcDepositHelper({
        sbtcWalletAddress,
        stacksAddress: `${(await helper.getStacksAccount(WALLET_00)).address}.sbtc-send-many`,
        amountSats: total,
        // we can use the helper to get an estimated fee for our transaction
        feeRate: await helper.estimateFeeRate('low'),
        // the helper will automatically parse through these and use one or some as inputs
        utxos,
        // where we want our remainder to be sent. UTXOs can only be spent as is, not divided, so we need a new input with the difference between our UTXO and how much we want to send
        bitcoinChangeAddress: btcAddress,
      });

      // convert the returned transaction object into a PSBT for Leather to use
      const psbt = tx.toPSBT();
      const requestParams = {
        publicKey: btcPublicKey,
        hex: bytesToHex(psbt),
      };
      // Call Leather API to sign the PSBT and finalize it
      const txResponse = await window.btc.request('signPsbt', requestParams);
      const formattedTx = btc.Transaction.fromPSBT(hexToBytes(txResponse.result.hex));
      formattedTx.finalize();

      // Broadcast it using the helper
      const finalTx = await helper.broadcastTx(formattedTx);

      // Get the transaction ID
      setStatus(finalTx);
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
            Deposit BTC
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
