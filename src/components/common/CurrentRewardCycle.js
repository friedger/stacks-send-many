import { useAtom } from 'jotai';
import { currentRewardCycle } from '../../store/cities';
import { currentBlockHeight } from '../../store/stacks';
import LoadingSpinner from './LoadingSpinner';

export default function CurrentRewardCycle({ symbol }) {
  const [blockHeight] = useAtom(currentBlockHeight);
  const [rewardCycle] = useAtom(currentRewardCycle);

  return blockHeight && rewardCycle ? (
    <p>
      Current {symbol ? symbol.toString() + ' ' : ''}Reward Cycle: {rewardCycle.toLocaleString()}
    </p>
  ) : (
    <LoadingSpinner text={`Loading current ${symbol ? symbol.toString() + ' ' : ''}reward cycle`} />
  );
}
