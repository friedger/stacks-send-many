import { callReadOnlyFunction, cvToJSON, uintCV } from '@stacks/transactions';
import { atom } from 'jotai';
import {
  CITYCOIN_CORE,
  CONTRACT_DEPLOYER,
  NETWORK,
  STACKS_API_FEE_URL,
  STACKS_API_V2_INFO,
} from './constants';

export const BLOCK_HEIGHT = atom({ value: 0, loading: false });
export const REWARD_CYCLE = atom({ value: 0, loading: false });

export async function refreshBlockHeight(block) {
  try {
    block(v => {
      return { value: v.value, loading: true };
    });
    const result = await fetch(STACKS_API_V2_INFO);
    const resultJson = await result.json();
    block(() => {
      return { value: resultJson?.stacks_tip_height, loading: false };
    });
  } catch (e) {
    console.log(e);
    block(v => {
      return { value: v.value, loading: false };
    });
  }
}

export async function refreshRewardCycle(cycle) {
  try {
    cycle(v => {
      return { value: v.value, loading: true };
    });
    const resultCV = await callReadOnlyFunction({
      contractAddress: CONTRACT_DEPLOYER,
      contractName: CITYCOIN_CORE,
      functionName: 'get-reward-cycle',
      functionArgs: [uintCV(cycle.value)],
      network: NETWORK,
      senderAddress: CONTRACT_DEPLOYER,
    });
    const resultJSON = cvToJSON(resultCV);
    console.log(`resultJSON: ${resultJSON}`);
    cycle(() => {
      return { value: cycle.value, loading: false };
    });
  } catch (e) {
    console.log(e);
  }
}

export async function getStxFees() {
  // get estimated fee from API, returns integer
  const result = await fetch(STACKS_API_FEE_URL);
  const feeValue = await result.json();
  return feeValue;
}
