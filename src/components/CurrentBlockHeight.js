import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { BLOCK_HEIGHT, refreshBlockHeight } from '../lib/blocks';

export function CurrentBlockHeight() {
  const [blockHeight, setBlockHeight] = useAtom(BLOCK_HEIGHT);

  useEffect(() => {
    refreshBlockHeight(setBlockHeight);
  }, [setBlockHeight]);

  if (blockHeight.value) {
    return <p>Current Block Height: {blockHeight.value}</p>;
  } else {
    return <p>Current Block Height: Unknown</p>;
  }
}
