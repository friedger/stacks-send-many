import {
  ClarityType,
  cvToHex,
  cvToString,
  cvToValue,
  hexToCV,
  tupleCV,
  uintCV,
} from '@stacks/transactions';
import { standardPrincipalCV, callReadOnlyFunction } from '@stacks/transactions';
import {
  accountsApi,
  GENESIS_CONTRACT_ADDRESS,
  NETWORK,
  smartContractsApi,
  CONTRACT_DEPLOYER,
  CITYCOIN_VRF,
  CITYCOIN_CORE,
  CITYCOIN_AUTH,
  CITYCOIN_TOKEN,
} from './constants';

export async function getCityCoinBalance(address) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_TOKEN,
    functionName: 'get-balance',
    functionArgs: [standardPrincipalCV(address)],
    network: NETWORK,
    senderAddress: address,
  });
  return result.value.value.toNumber();
}

export async function getMiningActivationStatus() {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'get-activation-status',
    functionArgs: [],
    network: NETWORK,
    senderAddress: GENESIS_CONTRACT_ADDRESS,
  });
  if (result.type == ClarityType.BoolTrue) {
    return true;
  } else {
    return false;
  }
}

export async function getRegisteredMinerId(address) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'get-user-id',
    functionArgs: [standardPrincipalCV(address)],
    network: NETWORK,
    senderAddress: address,
  });
  if (result.type === ClarityType.OptionalSome) {
    console.log(`Registered Miner Id ${result.value.value.toNumber()}`);
    return result.value.value.toNumber();
  } else {
    console.log(`Registered Miner Id ${undefined}`);
    return undefined;
  }
}

export async function getRegisteredMinerCount() {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'get-registered-users-nonce',
    functionArgs: [],
    network: NETWORK,
    senderAddress: GENESIS_CONTRACT_ADDRESS,
  });
  console.log(`Registered Miner Count ${result.value.toNumber()}`);
  return result.value.toNumber();
}

export async function getRegisteredMinersThreshold() {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'get-activation-threshold',
    functionArgs: [],
    network: NETWORK,
    senderAddress: GENESIS_CONTRACT_ADDRESS,
  });
  console.log(`Registered Miner Threshold ${result.value.toNumber()}`);
  return result.value.toNumber();
}
export async function getCoinbase(blockHeight) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'get-coinbase-amount',
    functionArgs: [uintCV(blockHeight)],
    senderAddress: CONTRACT_DEPLOYER,
    network: NETWORK,
  });
  return result.value.toNumber();
}

export async function getMiningDetails(stxAddress) {
  // get all account transactions
  const response = await accountsApi.getAccountTransactions({ principal: stxAddress });
  // filter transactions to successful mining calls
  const txs = response.results.filter(
    tx =>
      tx.tx_status === 'success' &&
      tx.tx_type === 'contract_call' &&
      (tx.contract_call.function_name === 'mine-tokens' ||
        tx.contract_call.function_name === 'mine-many') &&
      tx.contract_call.contract_id === `${CONTRACT_DEPLOYER}.${CITYCOIN_CORE}`
  );
  console.log(JSON.stringify(txs));
  // get the miner's ID
  const minerId = await getRegisteredMinerId(stxAddress);
  // set the winning details as empty
  const winningDetails = [];
  // for each mining transaction
  for (let tx of txs) {
    // if it was mine-many, iterate, otherwise get value
    if (tx.contract_call.function_name === 'mine-many') {
      let txResponse = tx.contract_call.function_args[0].repr;
      let txResponseSplit = txResponse.split(' ');
      for (let i = 0; i <= txResponseSplit.length - 1; i++) {
        winningDetails.push(await getWinningDetailsFor(tx.block_height + i, stxAddress));
      }
    } else {
      winningDetails.push(await getWinningDetailsFor(tx.block_height, stxAddress));
    }
  }
  return { count: winningDetails.length, winningDetails };
}

async function getWinningDetailsFor(blockHeight, stxAddress) {
  // was it claimed?
  // did they win?
  // maturity window?

  // claimed: yes, won: no = lost
  // claimed: yes, won: yes = done
  // claimed: no, won: no = lost
  // claimed: no, won: yes = canClaim

  console.log(`block height: ${blockHeight}`);
  const isWinnerAtBlock = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'is-block-winner',
    functionArgs: [standardPrincipalCV(stxAddress), uintCV(blockHeight)],
    senderAddress: CONTRACT_DEPLOYER,
    network: NETWORK,
  });
  console.log(`isWinnerAtBlock: ${cvToString(isWinnerAtBlock)}`);

  if (cvToValue(isWinnerAtBlock) === true) {
    console.log('returning a WINNER');
    const claim = await callReadOnlyFunction({
      contractAddress: CONTRACT_DEPLOYER,
      contractName: CITYCOIN_CORE,
      functionName: 'can-claim-mining-reward',
      functionArgs: [standardPrincipalCV(stxAddress), uintCV(blockHeight)],
      senderAddress: CONTRACT_DEPLOYER,
      network: NETWORK,
    });
    console.log(`claim: ${cvToValue(claim)}`);
    const canClaim = cvToValue(claim);
    const coinbase = await getCoinbase(blockHeight);
    console.log(`coinbase: ${coinbase}`);
    return { blockHeight, winner: true, coinbase, canClaim };
  } else {
    console.log('returning NOT a winner');
    return { blockHeight, lost: true };
  }

  /*

  // 3547 single mine-tokens
  // 3535-3544 10 mine-many
  // 3545 single mine-tokens
  
  */
}

export async function getPoxLiteInfo() {
  const poxLiteInfo = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'get-pox-lite-info',
    functionArgs: [],
    senderAddress: CONTRACT_DEPLOYER,
    network: NETWORK,
  });
  return poxLiteInfo;
}

export async function getAvailableRewards(stxAddress, userId, cycleId) {
  const stackingReward = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'get-stacking-reward',
    functionArgs: [uintCV(userId), uintCV(cycleId)],
    senderAddress: stxAddress,
    network: NETWORK,
  });
  const cityCoinClaim = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'get-stacker-at-cycle',
    functionArgs: [uintCV(cycleId), uintCV(await getRegisteredMinerId(stxAddress))],
    senderAddress: stxAddress,
    network: NETWORK,
  });
  console.log(`Claim ${JSON.stringify(cityCoinClaim)}`);
  console.log(`stackingReward ${JSON.stringify(stackingReward)}`);
  const result = {
    amountSTX: stackingReward.value.toNumber(),
    amountCC: cityCoinClaim.type,
    cycleId,
    stxAddress,
  };
  console.log({ result });
  return result;
}

export async function getStackingState(stxAddress) {
  const response = await accountsApi.getAccountTransactions({ principal: stxAddress });
  const txs = response.results.filter(
    tx =>
      tx.tx_status === 'success' &&
      tx.tx_type === 'contract_call' &&
      tx.contract_call.function_name === 'stack-tokens' &&
      tx.contract_call.contract_id === `${CONTRACT_DEPLOYER}.${CITYCOIN_CORE}`
  );
  const state = [];
  for (let tx of txs) {
    // TODO use better tx result like this:
    /*
    const firstCycle = hexToCV(tx.tx_result).data.first.value.toNumber();
    const lastCycle = hexToCV(tx.tx_result).data.last.value.toNumber();
    */
    console.log(`TX Contract Call ${JSON.stringify(tx.contract_call)}`);
    const firstCycle = Math.floor(
      (hexToCV(tx.contract_call.function_args[1].hex).value.toNumber() - 14726) / 50
    );
    const lockPeriod = hexToCV(tx.contract_call.function_args[1].hex).value.toNumber();
    const lastCycle = firstCycle + lockPeriod;

    for (let i = lastCycle; i >= firstCycle; i--) {
      state.push(await getAvailableRewards(stxAddress, await getRegisteredMinerId(stxAddress), i));
    }
  }
  return state;
}
