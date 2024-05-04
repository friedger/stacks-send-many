import { p2tr } from '@scure/btc-signer';
import { BufferCV, SomeCV, callReadOnlyFunction } from '@stacks/transactions';
import { MAINNET, REGTEST, TESTNET } from 'sbtc';
import { NETWORK, mainnet, testnet } from './constants';

export async function getSbtcWalletAddress(assetContract: string) {
  const [contractAddress, contractName] = assetContract.split('.');

  const publicKey = (await callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: 'get-bitcoin-wallet-public-key',
    functionArgs: [],
    senderAddress: contractAddress,
    network: NETWORK,
  })) as SomeCV<BufferCV>;

  let bitcoinNetwork;
  if (mainnet) {
    bitcoinNetwork = MAINNET;
  } else if (testnet) {
    bitcoinNetwork = TESTNET;
  } else {
    bitcoinNetwork = REGTEST;
  }

  const addr = p2tr(publicKey.value.buffer, undefined, bitcoinNetwork).address;
  console.log(addr);
  return addr;
}
