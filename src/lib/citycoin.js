import { ClarityType, uintCV } from '@stacks/transactions';
import { standardPrincipalCV, callReadOnlyFunction } from '@stacks/transactions';
import {
  accountsApi,
  CITYCOIN_CONTRACT_NAME,
  CONTRACT_ADDRESS,
  GENESIS_CONTRACT_ADDRESS,
  NETWORK,
  smartContractsApi,
} from './constants';

export async function getCityCoinBalance(address) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CITYCOIN_CONTRACT_NAME,
    functionName: 'get-balance',
    functionArgs: [standardPrincipalCV(address)],
    network: NETWORK,
    senderAddress: address,
  });
  return result.value.value.toNumber();
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
  return result.type === ClarityType.BoolTrue;
}

export async function getRegisteredMinerId(address) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CITYCOIN_CONTRACT_NAME,
    functionName: 'get-miner-id',
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

export async function getMiningTx(stxAddress) {
  const response = await accountsApi.getAccountTransactions({ principal: stxAddress });
  const txs = response.results.filter(
    tx =>
      tx.tx_status === 'success' &&
      tx.tx_type === 'contract_call' &&
      tx.contract_call.function_name === 'mine-tokens' &&
      tx.contract_call.contract_id === `${CONTRACT_ADDRESS}.${CITYCOIN_CONTRACT_NAME}`
  );
  const count = txs.length;
  console.log(txs);
  for (let tx of txs) {
    await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CITYCOIN_CONTRACT_NAME,
      functionName:"claim-token-reward",
      functionArgs:[uintCV(tx.block_height)]
    })
  }
  return { count, txs };
}
