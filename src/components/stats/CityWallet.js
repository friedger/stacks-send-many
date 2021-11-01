import LinkAddress from '../common/LinkAddress';

export default function CityWallet(props) {
  return (
    <div className="col-md-6 border">
      <p className="fw-bold">City Wallet</p>
      <p>
        <LinkAddress address={props.config.cityWallet} />
      </p>
      <p>Balance in STX</p>
      <p>Balance in USD</p>
    </div>
  );
}
