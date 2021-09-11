import { callReadOnlyFunction, ClarityType, cvToJSON, uintCV } from '@stacks/transactions';
import { atom } from 'jotai';
import {
  CITYCOIN_CORE,
  CONTRACT_DEPLOYER,
  NETWORK,
  STACKS_API_FEE_URL,
  STACKS_API_V2_INFO,
} from './constants';

export const BLOCK_HEIGHT = atom({ value: 0, loading: false, initialized: false });
export const REWARD_CYCLE = atom({ value: 0, loading: false, initialized: false });

export async function refreshBlockHeight(block) {
  try {
    block(v => {
      return { value: v.value, loading: true, initialized: v.initialized };
    });
    const result = await fetch(STACKS_API_V2_INFO);
    const resultJson = await result.json();
    block(() => {
      return { value: resultJson?.stacks_tip_height, loading: false, initialized: true };
    });
  } catch (e) {
    console.log(e);
    block(v => {
      return { value: v.value, loading: false, initialized: true };
    });
  }
}

export async function refreshRewardCycle(cycle, blockHeight) {
  if (blockHeight) {
    try {
      cycle(v => {
        return { value: v.value, loading: true, initialized: v.initialized };
      });
      const resultCV = await callReadOnlyFunction({
        contractAddress: CONTRACT_DEPLOYER,
        contractName: CITYCOIN_CORE,
        functionName: 'get-reward-cycle',
        functionArgs: [uintCV(blockHeight)],
        network: NETWORK,
        senderAddress: CONTRACT_DEPLOYER,
      });

      cycle(() => {
        let value;
        if (resultCV.type === ClarityType.OptionalSome) {
          value = resultCV.value.value.toNumber();
        } else {
          value = 'not found';
        }
        return { value, loading: false, initialized: true};
      });
    } catch (e) {
      console.log(e);
    }
  }
}

export async function getStxFees() {
  // get estimated fee from API, returns integer
  const result = await fetch(STACKS_API_FEE_URL);
  const feeValue = await result.json();
  return feeValue;
}
