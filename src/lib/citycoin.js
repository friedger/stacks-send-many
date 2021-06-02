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
export async function getCoinbase(blockHeight) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CITYCOIN_CONTRACT_NAME,
    functionName: 'get-coinbase-amount',
    functionArgs: [uintCV(blockHeight)],
    senderAddress: CONTRACT_ADDRESS,
    network: NETWORK,
  });
  return result.value.toNumber()
}

export async function getMiningDetails(stxAddress) {
  const response = await accountsApi.getAccountTransactions({ principal: stxAddress });
  const txs = response.results.filter(
    tx =>
      tx.tx_status === 'success' &&
      tx.tx_type === 'contract_call' &&
      tx.contract_call.function_name === 'mine-tokens' &&
      tx.contract_call.contract_id === `${CONTRACT_ADDRESS}.${CITYCOIN_CONTRACT_NAME}`
  );
  const minerId = await getRegisteredMinerId(stxAddress);
  console.log({ minerId });
  const winningDetails = [];
  console.log(txs);
  for (let tx of txs) {
    const randomSample = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CITYCOIN_CONTRACT_NAME,
      functionName: 'get-random-uint-at-block',
      functionArgs: [uintCV(tx.block_height + 100)],
      senderAddress: CONTRACT_ADDRESS,
      network: NETWORK,
    });
    console.log({ randomSample: randomSample.value.value.toString('hex') });

    const blockWinner = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CITYCOIN_CONTRACT_NAME,
      functionName: 'get-block-winner',
      functionArgs: [uintCV(tx.block_height), uintCV(randomSample.value.value.toString())],
      senderAddress: CONTRACT_ADDRESS,
      network: NETWORK,
    });
    if (
      blockWinner.type === ClarityType.OptionalSome &&
      blockWinner.value.data['miner-id'].value === minerId.value
    ) {
      const coinbase = await getCoinbase(tx.block_height);
      winningDetails.push({ tx, winner: blockWinner.value, coinbase });
    } else {
      console.log('unlucky on block ', tx.block_height);
    }
  }
  return { count: winningDetails.length, winningDetails };
}
