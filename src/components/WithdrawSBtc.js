import * as btc from '@scure/btc-signer';
import { bytesToHex, hexToBytes } from '@stacks/common';
import { openSignatureRequestPopup } from '@stacks/connect';
import React, { useRef, useState } from 'react';
import {
  DevEnvHelper,
  TESTNET,
  TestnetHelper,
  WALLET_00,
  sbtcWithdrawHelper,
  sbtcWithdrawMessage,
} from 'sbtc';
import { useConnect } from '../lib/auth';
import { NETWORK, mocknet } from '../lib/constants';

export function WithdrawSBtc() {
  const spinner = useRef();
  const amountSatsRef = useRef();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState();
  const { userSession } = useConnect();
  const [signature, setSignature] = useState('');

  const signMessage = async e => {
    e.preventDefault();
    const total = parseInt(amountSatsRef.current.value);

    const userData = userSession.loadUserData();
    let profile = userData.profile;
    if (mocknet) {
      console.log('Using mocknet');
      let helper = new DevEnvHelper();
      const btcAccount = await helper.getBitcoinAccount(WALLET_00, 2);
      profile = {
        btcAddress: { p2wpkh: { testnet: btcAccount.wpkh.address } },
        btcPublicKey: { p2wpkh: btcAccount.publicKey.buffer.toString() },
      };
    }

    // First we need to sign a Stacks message to prove we own the sBTC
    // The sbtc paclage can help us format this
    const message = sbtcWithdrawMessage({
      network: mocknet ? undefined : TESTNET,
      amountSats: total,
      bitcoinAddress: profile.btcAddress.p2wpkh.testnet,
    });

    // Now we can use Leather to sign that message
    openSignatureRequestPopup({
      message,
      userSession,
      network: NETWORK,
      onFinish: data => {
        // Here we set the signature
        setSignature(data.signature);
        setStatus('Signature received');
      },
    });
  };

  const sendAction = async () => {
    setLoading(true);
    setStatus();

    const total = parseInt(amountSatsRef.current.value);
    console.log({ total });

    let helper = new TestnetHelper();

    const userData = userSession.loadUserData();
    let profile = userData.profile;
    let sbtcWalletAddress = 'TODO';
    if (mocknet) {
      console.log('Using mocknet');
      helper = new DevEnvHelper();
      const btcAccount = await helper.getBitcoinAccount(WALLET_00, 2);
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

    const tx = await sbtcWithdrawHelper({
      sbtcWalletAddress,
      bitcoinAddress: btcAddress,
      amountSats: total,
      signature,
      // we can use the helper to get an estimated fee for our transaction
      feeRate: await helper.estimateFeeRate('low'),
      // the helper will automatically parse through these and use one or some as inputs
      utxos,
      // where we want our remainder to be sent. UTXOs can only be spent as is, not divided, so we need a new input with the difference between our UTXO and how much we want to send
      bitcoinChangeAddress: btcAddress,
      fulfillmentFeeSats: 2000,
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

    setLoading(false);
  };

  return (
    <div>
      <div>
        <div className="row">
          <div className="col-md-12 col-xs-12 col-lg-12 text-right pb-2">
            <input
              ref={amountSatsRef}
              type="text"
              placeholder="sBTC amount in sats"
              className="form-control"
            />
          </div>
        </div>
        <div className="input-group mt-2">
          <button
            className="btn btn-block btn-primary"
            type="button"
            onClick={signature ? sendAction : signMessage}
          >
            <div
              ref={spinner}
              role="status"
              className={`${
                loading ? '' : 'd-none'
              } spinner-border spinner-border-sm text-info align-text-top mr-2`}
            />
            {signature ? 'Broadcast Withdraw Tx' : 'Sign Withdraw Tx'}
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
