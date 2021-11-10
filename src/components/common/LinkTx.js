import { testnet } from '../../lib/stacks';

export default function LinkTx({ txId, shorten = true }) {
  !txId.startsWith('0x') && (txId = `0x${txId}`);
  const url = `https://explorer.stacks.co/txid/${txId}`;
  return (
    <a
      href={`${url}${testnet ? '?chain=testnet' : '?chain=mainnet'}`}
      target="_blank"
      rel="noreferrer"
    >
      {shorten ? txId.substr(0, 5) + '...' + txId.substr(txId.length - 5) : txId}
      <i className="bi bi-box-arrow-up-right ms-1" />
    </a>
  );
}
