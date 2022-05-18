import { useAtom } from 'jotai';
import { currentRewardCycleAtom } from '../../store/cities';
import { currentStacksBlockAtom } from '../../store/stacks';
import LoadingSpinner from './LoadingSpinner';

export default function CurrentRewardCycle({ symbol }) {
  const [currentStacksBlock] = useAtom(currentStacksBlockAtom);
  const [currentRewardCycle] = useAtom(currentRewardCycleAtom);

  return currentStacksBlock.loaded && currentRewardCycle.loaded ? (
    <p>
      Current {symbol ? symbol.toString() + ' ' : ''}Reward Cycle:{' '}
      {currentRewardCycle.data.toLocaleString()}
    </p>
  ) : (
    <LoadingSpinner text={`Loading current ${symbol ? symbol.toString() + ' ' : ''}reward cycle`} />
  );
}
