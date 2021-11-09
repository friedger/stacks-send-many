import { useEffect, useState } from 'react';
import { getStxBalance, ustxToStx } from '../../lib/stacks';
import LinkAddress from '../common/LinkAddress';
import LoadingSpinner from '../common/LoadingSpinner';

export default function CityWallet(props) {
  const [cityWalletBalance, setCityWalletBalance] = useState(0);

  useEffect(() => {
    getStxBalance(props.config.cityWallet)
      .then(result => {
        setCityWalletBalance(result);
      })
      .catch(err => {
        setCityWalletBalance(0);
        console.log(err);
      });
  }, [props.config.cityWallet]);

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
          <div className="col-sm-6">
            {cityWalletBalance ? (
              `${ustxToStx(cityWalletBalance).toLocaleString(undefined, {
                style: 'decimal',
                minimumFractionDigits: 6,
                maximumFractionDigits: 6,
              })} Ӿ`
            ) : (
              <LoadingSpinner />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
