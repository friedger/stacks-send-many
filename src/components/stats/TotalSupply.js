import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { currentBlockHeight, stxRateAtom } from '../../store/common';
import { getTotalSupply } from '../../lib/citycoins';
import LoadingSpinner from '../common/LoadingSpinner';
import { updateStxRate } from '../../lib/coingecko';

export default function TotalSupply(props) {
  const [blockHeight] = useAtom(currentBlockHeight);
  const [stxRate, setStxRate] = useAtom(stxRateAtom);
  const [maxSupply, setMaxSupply] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);

  useEffect(() => {
    if (blockHeight) {
      // calculate max supply
      // hardcoded for the first 4 years
      // TODO: separate this into a lib function
      const bonusPeriod = 10000;
      const startBlock = props.config.startBlock;
      const blocksPast = blockHeight - startBlock;
      if (blocksPast > bonusPeriod) {
        setMaxSupply(bonusPeriod * 250000 + (blocksPast - bonusPeriod) * 100000);
      } else {
        setMaxSupply(blocksPast * 250000);
      }

      // get total supply from contract
      getTotalSupply(props.contracts.deployer, props.contracts.tokenContract)
        .then(result => {
          setTotalSupply(result.value.value);
        })
        .catch(err => console.log(err));

      // TODO: calculate market cap
    }
  }, [
    blockHeight,
    props.config.startBlock,
    props.contracts.deployer,
    props.contracts.tokenContract,
  ]);

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
        <p className="fs-5 text-center">{props.token.symbol} Supply</p>
        <div className="row text-center text-sm-start">
          <div className="col-sm-6">Max Supply</div>
          <div className="col-sm-6">
            {maxSupply ? `${maxSupply.toLocaleString()} ${props.token.symbol}` : <LoadingSpinner />}
          </div>
        </div>
        <div className="row text-center text-sm-start">
          <div className="col-sm-6">Total Supply</div>
          <div className="col-sm-6">
            {totalSupply ? (
              `${totalSupply.toLocaleString()} ${props.token.symbol}`
            ) : (
              <LoadingSpinner />
            )}
          </div>
        </div>
        <div className="row text-center text-sm-start">
          <div className="col-sm-6">Market Cap</div>
          <div className="col-sm-6">TBD</div>
        </div>
      </div>
    </div>
  );
}
