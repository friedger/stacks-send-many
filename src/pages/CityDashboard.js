import MiningActivity from '../components/dashboard/MiningActivity';
import MiningStats from '../components/dashboard/MiningStats';
import StackingActivity from '../components/dashboard/StackingActivity';
import StackingStats from '../components/dashboard/StackingStats';
import TransactionLog from '../components/dashboard/TransactionLog';

export default function CityDashboard() {
  return (
    <>
      <MiningActivity />
      <MiningStats />
      <StackingActivity />
      <StackingStats />
      <TransactionLog />
    </>
  );
}
