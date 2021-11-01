export default function LinkAddress({ address, shorten = true }) {
  const url = `https://explorer.stacks.co/address/${address}`;
  return (
    <a href={url} target="_blank" rel="noreferrer">
      {shorten ? address.substr(0, 5) + '...' + address.substr(address.length - 5) : address}
      <i className="bi bi-box-arrow-up-right ms-1" />
    </a>
  );
}
