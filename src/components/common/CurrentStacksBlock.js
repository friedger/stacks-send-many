import { useAtom } from 'jotai';
import { currentBlockHeight } from '../../store/common';

export default function CurrentStacksBlock() {
  const [blockHeight] = useAtom(currentBlockHeight);
  return (
    <p>Current Stacks Block Height: {blockHeight ? blockHeight.toLocaleString() : 'Loading...'}</p>
  );
}
