import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { updateStxRate } from '../../lib/coingecko';
import { getStxBalance, ustxToStx } from '../../lib/stacks';
import { stxRateAtom } from '../../store/common';
import LinkAddress from '../common/LinkAddress';
import LoadingSpinner from '../common/LoadingSpinner';

export default function CityWallet(props) {
  const [cityWalletBalance, setCityWalletBalance] = useState(0);
  const [stxRate, setStxRate] = useAtom(stxRateAtom);

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

  useEffect(() => {
    const updateStxPrice = async () => {
      const rate = await updateStxRate()
        .then(result => setStxRate(result))
        .catch(err => {
          setStxRate(0);
          console.log(err);
        });
    };
  }, [setStxRate]);

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
        <div className="row text-center text-sm-start">
          <div className="col-sm-6">USD Value</div>
          <div className="col-sm-6">
            {stxRate && cityWalletBalance ? (
              `$${(ustxToStx(cityWalletBalance) * stxRate).toLocaleString(undefined, {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} USD`
            ) : (
              <LoadingSpinner />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
