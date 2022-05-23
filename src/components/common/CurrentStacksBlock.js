import { useAtom } from 'jotai';
import { currentStacksBlockAtom } from '../../store/stacks';
import LoadingSpinner from './LoadingSpinner';

export default function CurrentStacksBlock() {
  const [currentStacksBlock] = useAtom(currentStacksBlockAtom);
  return currentStacksBlock.loaded ? (
    <p>Current Stacks Block: {currentStacksBlock.data.toLocaleString()}</p>
  ) : (
    <LoadingSpinner text="Loading current Stacks block" />
  );
}
