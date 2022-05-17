import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useEffect } from 'react';
import NoCitySelected from '../components/common/NoCitySelected';
import MiningActivity from '../components/dashboard/MiningActivity';
import MiningStats from '../components/dashboard/MiningStats';
import StackingActivity from '../components/dashboard/StackingActivity';
import StackingStats from '../components/dashboard/StackingStats';
import TransactionLog from '../components/dashboard/TransactionLog';
import { getBlockHeight } from '../lib/stacks';
import { currentCity } from '../store/cities';
import { currentBlockHeight } from '../store/stacks';

export default function CityDashboard() {
  const [city] = useAtom(currentCity);
  const setBlockHeight = useUpdateAtom(currentBlockHeight);

  useEffect(() => {
    getBlockHeight().then(result => setBlockHeight(result));
  });

  return city === '' ? (
    <NoCitySelected />
  ) : (
    <>
      <MiningActivity />
      <MiningStats />
      <StackingActivity />
      <StackingStats />
      <TransactionLog />
    </>
  );
}
