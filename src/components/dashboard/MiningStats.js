import { useEffect, useState } from 'react';
import { getMiningStatsAtBlockOrDefaults } from '../../lib/citycoins';
import { ustxToStx } from '../../lib/stacks';
import LoadingSpinner from '../common/LoadingSpinner';

export default function MiningStats(props) {
  const [totalMiners, setTotalMiners] = useState(0);
  const [totalAmountUstx, setTotalAmountUstx] = useState(0);
  const [totalAmountCity, setTotalAmountCity] = useState(0);
  const [totalAmountStackers, setTotalAmountStackers] = useState(0);

  useEffect(() => {
    getMiningStatsAtBlockOrDefaults(
      props.contracts.deployer,
      props.contracts.coreContract,
      props.blockHeight
    )
      .then(result => {
        setTotalMiners(result.value.minersCount.value);
        setTotalAmountUstx(result.value.amount.value);
        setTotalAmountCity(result.value.amountToCity.value);
        setTotalAmountStackers(result.value.amountToStackers.value);
      })
      .catch(err => {
        console.log(err);
        setTotalMiners(0);
        setTotalAmountUstx(0);
        setTotalAmountCity(0);
        setTotalAmountStackers(0);
      });
  });

  return (
    <div className="border rounded p-3 text-nowrap">
      <p className="fs-5 text-center">Block #{props.blockHeight.toLocaleString()}</p>
      <div className="row text-center text-sm-start">
        <div className="col-sm-6">Miners</div>
        <div className="col-sm-6">{totalMiners ? totalMiners : <LoadingSpinner />}</div>
      </div>
      <div className="row text-center text-sm-start">
        <div className="col-sm-6">Amount</div>
        <div className="col-sm-6">
          {totalAmountUstx ? (
            ustxToStx(totalAmountUstx).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }) + ' STX'
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
      <div className="row text-center text-sm-start">
        <div className="col-sm-6">To City</div>
        <div className="col-sm-6">
          {totalAmountCity ? (
            ustxToStx(totalAmountCity).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }) + ' STX'
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
      <div className="row text-center text-sm-start">
        <div className="col-sm-6">To Stackers</div>
        <div className="col-sm-6">
          {totalAmountStackers ? (
            ustxToStx(totalAmountStackers).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }) + ' STX'
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
    </div>
  );
}
