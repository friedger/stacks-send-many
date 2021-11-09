import {
  callReadOnlyFunction,
  cvToJSON,
  cvToValue,
  standardPrincipalCV,
  uintCV,
} from '@stacks/transactions';
import { NETWORK } from './stacks';

// enable/disable console logging for each function
const debug = false;

///////////////////////////////////////////////////////////////////////////////
// CORE: CITY WALLET
///////////////////////////////////////////////////////////////////////////////

// returns the city wallet principal
export async function getCityWallet(contractAddress, contractName) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-city-wallet',
    functionArgs: [],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToValue(resultCv);
  debug && console.log(result);
  return result;
}

///////////////////////////////////////////////////////////////////////////////
// CORE: REGISTRATION
///////////////////////////////////////////////////////////////////////////////

// returns the activation block height
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
  debug && console.log(result);
  return result;
}

// returns the activation delay
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
  debug && console.log(result);
  return result;
}

// returns the activation status
export async function getActivationStatus(contractAddress, contractName) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-activation-status',
    functionArgs: [],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  debug && console.log(result);
  return result;
}

// returns the activation threshold
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
  debug && console.log(result);
  return result;
}

// returns the current number of registered users
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
  debug && console.log(result);
  return result;
}

// returns the user ID of the given address
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
  debug && console.log(result);
  return result;
}

// returns the user address of the given ID
export async function getUser(contractAddress, contractName, userId) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-user',
    functionArgs: [uintCV(userId)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  debug && console.log(result);
  return result;
}

// TODO: add register-user public function

///////////////////////////////////////////////////////////////////////////////
// CORE: MINING
///////////////////////////////////////////////////////////////////////////////

// returns the mining stats for a given block height, or none
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
  debug && console.log(result);
  return result;
}

// returns the mining stats for a given block height, or defaults
export async function getMiningStatsAtBlockOrDefaults(contractAddress, contractName, blockHeight) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-mining-stats-at-block-or-default',
    functionArgs: [uintCV(blockHeight)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  debug && console.log(result);
  return result;
}

// returns true if user has mined at a block
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
  debug && console.log(result);
  return result;
}

// returns the mining stats for a given block height and user ID, or none
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
  debug && console.log(result);
  return result;
}

// returns the mining stats for a given block height and user ID, or defaults
export async function getMinerAtBlockOrDefault(contractAddress, contractName, blockHeight, userId) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-miner-at-block-or-default',
    functionArgs: [uintCV(blockHeight), uintCV(userId)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  debug && console.log(result);
  return result;
}

// returns the high value for a given block
export async function getLastHighValueAtBlock(contractAddress, contractName, blockHeight) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-last-high-value-at-block',
    functionArgs: [uintCV(blockHeight)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  debug && console.log(result);
  return result;
}

// returns the block winner ID
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
  debug && console.log(result);
  return result;
}

/*
PUBLIC FUNCTIONS NEED SOME EXTRA THOUGHT AND TRICKERY
mostly because I need to learn more about react hooks

// calls mine-tokens public function for a single block
export async function MineTokens(contractAddress, contractName, senderAddress, amountUstx, memo) {
  const { doContractCall } = useConnect();
  const amountUstxCV = uintCV(amountUstx);
  const memoCV = memo ? someCV(bufferCVFromString(memo.trim())) : noneCV();
  const postConditions = makeStandardSTXPostCondition(
    senderAddress,
    FungibleConditionCode.Equal,
    amountUstx.value
  );
  await doContractCall({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'mine-tokens',
    functionArgs: [amountUstxCV, memoCV],
    postConditionMode: PostConditionMode.Deny,
    postConditions: postConditions,
    network: NETWORK,
    senderAddress: senderAddress,
    onCancel: () => {
      console.log('mineTokens cancelled');
    },
    onFinish: result => {
      console.log('mineTokens finished');
      debug && console.log(result);
      return result;
    },
  }).catch(err => console.log(`mineTokens err: ${err}`));
}

// calls mine-many public function for multiple blocks
export async function MineMany(contractAddress, contractName, senderAddress, amountUstx, memo) {
  // mine many blocks
}

*/

///////////////////////////////////////////////////////////////////////////////
// CORE: MINING CLAIMS
///////////////////////////////////////////////////////////////////////////////

// TODO: add claim-mining-reward public function

// returns if a user has won a given block
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
  debug && console.log(result);
  return result;
}

// returns if a user won a given block and can claim the reward
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
  debug && console.log(result);
  return result;
}

///////////////////////////////////////////////////////////////////////////////
// CORE: STACKING
///////////////////////////////////////////////////////////////////////////////

// returns the stacking stats at a given cycle, or none
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
  debug && console.log(result);
  return result;
}

// returns the stacking stats at a given cycle, or defaults
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
  debug && console.log(result);
  return result;
}

// returns the stacking stats at a given cycle for a given user ID, or none
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
  debug && console.log(result);
  return result;
}

// returns the stacking stats at a given cycle for a given user ID, or defaults
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
  debug && console.log(result);
  return result;
}

// returns the reward cycle for a given block height
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
  debug && console.log(result);
  return result;
}

// returns if stacking is active at a given cycle
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
  debug && console.log(result);
  return result;
}

// returns the first stacks block in a given reward cycle
export async function getFirstStacksBlockInRewardCycle(contractAddress, contractName, cycleId) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-first-stacks-block-in-reward-cycle',
    functionArgs: [uintCV(cycleId)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  debug && console.log(result);
  return result;
}

// returns the stacking reward for given user and a given reward cycle
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
  debug && console.log(result);
  return result;
}

// TODO: add stack-tokens public function

///////////////////////////////////////////////////////////////////////////////
// CORE: STACKING CLAIMS
///////////////////////////////////////////////////////////////////////////////

// TODO: add claim-stacking-reward public function

///////////////////////////////////////////////////////////////////////////////
// CORE: TOKEN CONFIGURATION
///////////////////////////////////////////////////////////////////////////////

// returns the coinbase thresholds set by register-user
// can be called against core or token contracts
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
  debug && console.log(result);
  return result;
}

// returns the coinbase amount minted for a given block height
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
  debug && console.log(result);
  return result;
}

///////////////////////////////////////////////////////////////////////////////
// TOKEN: SIP-010
///////////////////////////////////////////////////////////////////////////////

// TODO: add transfer public function

// returns the name of the token
export async function getName(contractAddress, contractName) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-name',
    functionArgs: [],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  debug && console.log(result);
  return result;
}

// returns the symbol of the token
export async function getSymbol(contractAddress, contractName) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-symbol',
    functionArgs: [],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  debug && console.log(result);
  return result;
}

// returns the decimals of the token
export async function getDecimals(contractAddress, contractName) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-decimals',
    functionArgs: [],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  debug && console.log(result);
  return result;
}

// returns the balance for a given address
export async function getBalance(contractAddress, contractName, address) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-balance',
    functionArgs: [standardPrincipalCV(address)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  debug && console.log(result);
  return result;
}

// returns the total supply of the token
export async function getTotalSupply(contractAddress, contractName) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-total-supply',
    functionArgs: [],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  debug && console.log(result);
  return result;
}

// returns the token URI
export async function getTokenUri(contractAddress, contractName) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-token-uri',
    functionArgs: [],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  debug && console.log(result);
  return result;
}

///////////////////////////////////////////////////////////////////////////////
// TOKEN: SEND MANY
///////////////////////////////////////////////////////////////////////////////

// TODO: add send-many public function

///////////////////////////////////////////////////////////////////////////////
// AUTH
///////////////////////////////////////////////////////////////////////////////

//(define-read-only (is-initialized)
//  (var-get initialized)
//)

// can be called against core or token contracts
export async function isInitialized(contractAddress, contractName) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'is-initialized',
    functionArgs: [],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToValue(resultCv);
  debug && console.log(result);
  return result;
}
