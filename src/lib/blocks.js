import { atom } from 'jotai';
import { STACKS_API_V2_INFO } from './constants';

export const BLOCK_HEIGHT = atom({ value: 0, loading: false });

export async function refreshBlockHeight(update) {
  try {
    update(v => {
      return { value: v.value, loading: true };
    });
    const result = await fetch(STACKS_API_V2_INFO);
    const resultJson = await result.json();
    update(v => {
      return { value: resultJson?.stacks_tip_height, loading: false };
    });
  } catch (e) {
    console.log(e);
    update(v => {
      return { value: v.value, loading: false };
    });
  }
}
