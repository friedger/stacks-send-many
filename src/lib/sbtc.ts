import { p2tr } from '@scure/btc-signer';
import { callReadOnlyFunction } from '@stacks/transactions';
import { MAINNET, REGTEST, TESTNET } from 'sbtc';
import { NETWORK, mainnet, testnet } from './constants';

export async function getSbtcWalletAddress(assetContract: string) {
  const [contractAddress, contractName] = assetContract.split('.');

  const publicKey = await callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: 'get-bitcoin-wallet-public-key',
    functionArgs: [],
    senderAddress: contractAddress,
    network: NETWORK,
  });

  let bitcoinNetwork;
  if (mainnet) {
    bitcoinNetwork = MAINNET;
  } else if (testnet) {
    bitcoinNetwork = TESTNET;
  } else {
    bitcoinNetwork = REGTEST;
  }

  const addr = p2tr(publicKey, undefined, bitcoinNetwork).address;
  console.log(addr);
  return addr;
}
