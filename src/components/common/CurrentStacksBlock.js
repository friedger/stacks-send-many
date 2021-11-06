import { useAtom } from 'jotai';
import { currentBlockHeight } from '../../store/common';
import LoadingSpinner from './LoadingSpinner';

export default function CurrentStacksBlock() {
  const [blockHeight] = useAtom(currentBlockHeight);
  return (
    <p>
      Current Stacks Block Height: {blockHeight ? blockHeight.toLocaleString() : <LoadingSpinner />}
    </p>
  );
}
