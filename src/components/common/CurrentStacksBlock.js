import { useAtom } from 'jotai';
import { currentBlockHeight } from '../../store/stacks';
import LoadingSpinner from './LoadingSpinner';

export default function CurrentStacksBlock() {
  const [blockHeight] = useAtom(currentBlockHeight);
  return blockHeight ? (
    <p>Current Stacks Block: {blockHeight.toLocaleString()}</p>
  ) : (
    <LoadingSpinner text="Loading current Stacks block" />
  );
}
