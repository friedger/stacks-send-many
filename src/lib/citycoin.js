import { ClarityType } from '@stacks/transactions';
import { standardPrincipalCV, callReadOnlyFunction } from '@stacks/transactions';
import {
  CITYCOIN_CONTRACT_NAME,
  CONTRACT_ADDRESS,
  GENESIS_CONTRACT_ADDRESS,
  NETWORK,
} from './constants';

export async function getCityCoinBalance(address) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CITYCOIN_CONTRACT_NAME,
    functionName: 'get-balance-of',
    functionArgs: [standardPrincipalCV(address)],
    network: NETWORK,
    senderAddress: address,
  });
  return result.value.toNumber();
}

export async function getMiningActivationStatus() {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CITYCOIN_CONTRACT_NAME,
    functionName: 'get-mining-activation-status',
    functionArgs: [],
    network: NETWORK,
    senderAddress: GENESIS_CONTRACT_ADDRESS,
  });
  return result.value;
}

export async function getRegisteredMinerId(address) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CITYCOIN_CONTRACT_NAME,
    functionName: 'get-registered-miner-id',
    functionArgs: [standardPrincipalCV(address)],
    network: NETWORK,
    senderAddress: address,
  });
  if (result.type === ClarityType.OptionalSome) {
    return result.value.data.id.value.toNumber();
  } else {
    return undefined;
  }
}

export async function getRegisteredMinerCount() {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CITYCOIN_CONTRACT_NAME,
    functionName: 'get-registered-miners-nonce',
    functionArgs: [],
    network: NETWORK,
    senderAddress: GENESIS_CONTRACT_ADDRESS,
  });
  return result.value.toNumber();
}

export async function getRegisteredMinersThreshold() {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CITYCOIN_CONTRACT_NAME,
    functionName: 'get-registered-miners-threshold',
    functionArgs: [],
    network: NETWORK,
    senderAddress: GENESIS_CONTRACT_ADDRESS,
  });
  return result.value.toNumber();
}
