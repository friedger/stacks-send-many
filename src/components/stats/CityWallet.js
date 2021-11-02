import LinkAddress from '../common/LinkAddress';

export default function CityWallet(props) {
  return (
    <div className="col-lg-6">
      <div className="border rounded p-3 text-nowrap">
        <p className="fs-5 text-center">City Wallet</p>
        <div className="row text-center text-sm-start">
          <div className="col-sm-6">Address</div>
          <div className="col-sm-6">
            <LinkAddress address={props.config.cityWallet} />
          </div>
        </div>
        <div className="row text-center text-sm-start">
          <div className="col-sm-6">STX Balance</div>
          <div className="col-sm-6">TBD</div>
        </div>
        <div className="row text-center text-sm-start">
          <div className="col-sm-6">USD Value</div>
          <div className="col-sm-6">TBD</div>
        </div>
      </div>
    </div>
  );
}
