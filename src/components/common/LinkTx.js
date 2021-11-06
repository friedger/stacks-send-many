export default function LinkTx({ txId, shorten = true }) {
  const url = `https://explorer.stacks.co/txid/${txId}`;
  return (
    <a href={url} target="_blank" rel="noreferrer">
      {shorten ? txId.substr(0, 5) + '...' + txId.substr(txId.length - 5) : txId}
      <i className="bi bi-box-arrow-up-right ms-1" />
    </a>
  );
}
