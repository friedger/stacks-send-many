import { STACK_API_URL, testnet, mainnet } from '../lib/constants';
export function Network() {
  return (
    <div
      className={`rounded border-secondary d-flex justify-content-around p-1 mx-1 ${
        mainnet ? 'bg-primary' : 'bg-secondary'
      } align-self-center`}
      title={STACK_API_URL}
    >
      {mainnet ? 'mainnet' : testnet ? 'testnet' : 'mocknet'}
    </div>
  );
}
