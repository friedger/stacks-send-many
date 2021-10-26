import { 
  bufferCVFromString, 
  callReadOnlyFunction, 
  cvToJSON,
  PostConditionMode,
  FungibleConditionCode,
  standardPrincipalCV, 
  someCV, 
  noneCV } from '@stacks/transactions';
import { NETWORK } from './stacks';

// define constants
export const CITYCOIN_VRF = 'citycoin-vrf';

// read-only function that returns the user ID from the contract
export async function getUserId(contractAddress, contractName, address) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-user-id',
    functionArgs: [standardPrincipalCV(address)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// read-only function that returns if a user is the block winner
export async function isBlockWinner(contractAddress, contractName, address, blockHeight) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'is-block-winner',
    functionArgs: [standardPrincipalCV(address), uintCV(blockHeight)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// read-only function that returns if user has mined at a block
export async function hasMinedAtBlock(contractAddress, contractName, blockHeight, userId) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'has-mined-at-block',
    functionArgs: [uintCV(blockHeight), uintCV(userId)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// read-only function that returns if stacking is active at a given cycle
export async function stackingActiveAtCycle(contractAddress, contractName, cycleId) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'stacking-active-at-cycle',
    functionArgs: [uintCV(cycleId)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// read-only function that returns stacking stats at cycle or none
export async function getStackingStatsAtCycle(contractAddress, contractName, cycleId) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-stacking-stats-at-cycle',
    functionArgs: [uintCV(cycleId)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// read-only function that returns stacking stats at cycle or default
export async function getStackingStatsAtCycleOrDefault(contractAddress, contractName, cycleId) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-stacking-stats-at-cycle-or-default',
    functionArgs: [uintCV(cycleId)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// read-only function that returns stacking reward for a user
export async function getStackingReward(contractAddress, contractName, userId, targetCycle) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-stacking-reward',
    functionArgs: [uintCV(userId), uintCV(targetCycle)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// read-only function that returns stacker stats at cycle or none
export async function getStackerAtCycle(contractAddress, contractName, cycleId, userId) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-stacker-at-cycle',
    functionArgs: [uintCV(cycleId), uintCV(userId)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// read-only function that returns stacker stats at cycle or defaults
export async function getStackerAtCycleOrDefault(contractAddress, contractName, cycleId, userId) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-stacker-at-cycle-or-default',
    functionArgs: [uintCV(cycleId), uintCV(userId)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// read-only function that returns reward cycle for a given block height
export async function getRewardCycle(contractAddress, contractName, blockHeight) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-reward-cycle',
    functionArgs: [uintCV(blockHeight)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// read-only function that returns current number of registered users
export async function getRegisteredUsersNonce(contractAddress, contractName) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-registered-users-nonce',
    functionArgs: [],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// read-only function that returns the mining stats for a given block height
export async function getMiningStatsAtBlock(contractAddress, contractName, blockHeight) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-mining-stats-at-block',
    functionArgs: [uintCV(blockHeight)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// read-only function that returns a miner's stats at a given blockheight
export async function getMinerAtBlock(contractAddress, contractName, blockHeight, userId) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-miner-at-block',
    functionArgs: [uintCV(blockHeight), uintCV(userId)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// read-only function that returns the first stacks block in a given reward cycle
export async function getFirstStacksBlockInRewardCycle(contractAddress, contractName, blockHeight) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-first-stacks-block-in-reward-cycle',
    functionArgs: [uintCV(blockHeight)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// read-only function that returns the coinbase thresholds
export async function getCoinbaseThresholds(contractAddress, contractName) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-coinbase-thresholds',
    functionArgs: [],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// read-only function that returns the coinbase amount for a given block height
export async function getCoinbaseAmount(contractAddress, contractName, blockHeight) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-coinbase-amount',
    functionArgs: [uintCV(blockHeight)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// read-only function that returns the city wallet principal
export async function getCityWallet(contractAddress, contractName) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-city-wallet',
    functionArgs: [],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// read-only function that returns the block winner ID
export async function getBlockWinnerId(contractAddress, contractName, blockHeight) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-block-winner-id',
    functionArgs: [uintCV(blockHeight)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// read-only function that returns the activation threshold
export async function getActivationThreshold(contractAddress, contractName) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-activation-threshold',
    functionArgs: [],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// read-only function that returns the activation delay
export async function getActivationDelay(contractAddress, contractName) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-activation-delay',
    functionArgs: [],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// read-only function that returns the activation block height
export async function getActivationBlock(contractAddress, contractName) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-activation-block',
    functionArgs: [],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// read-only function that returns if a user can claim a mining reward
export async function canClaimMiningReward(contractAddress, contractName, address, blockHeight) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'can-claim-mining-reward',
    functionArgs: [standardPrincipalCV(address), uintCV(blockHeight)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// read-only function that returns the high value for a current block
export async function getHighValueAtBlock(contractAddress, contractName, blockHeight) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-high-value-at-block',
    functionArgs: [uintCV(blockHeight)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// public function that allows a user to mine tokens in a single block
export async function mineTokens(contractAddress, contractName, senderAddress, amountUstx, memo) {
  const amountUstxCV = uintCV(amountUstx);
  const memoCV = memo ? someCV(bufferCVFromString(memo.trim())) : noneCV()
  const postConditions = makeStandardSTXPostCondition(
    senderAddress,
    FungibleConditionCode.Equal,
    amountUstx.value
  );
  await doContractCall({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'mine-tokens',
    functionArgs: [
      amountUstxCV,
      memoCV
    ],
    postConditionMode: PostConditionMode.Deny,
    postConditions: postConditions,
    network: NETWORK,
    senderAddress: senderAddress,
    onCancel: () => {
      console.log('mineTokens cancelled');
    },
    onFinish: result => {
      console.log('mineTokens finished');
      console.log(result);
      return result;
    }
  }).catch(err => console.log(`mineTokens err: ${err}`));
}
