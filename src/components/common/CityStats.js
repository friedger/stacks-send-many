import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { getCurrentBlockHeight } from '../../lib/stacks';
import { currentBlockHeight } from '../../store/common';
import NavBackHome from './NavBackHome';
import NavBar from './NavBar';

export default function CityStats(props) {
  const [blockHeight, setBlockHeight] = useAtom(currentBlockHeight);

  useEffect(() => {
    async function getCurrentBlock() {
      const currentBlock = await getCurrentBlockHeight();
      setBlockHeight(currentBlock);
    }
    getCurrentBlock();
  }, [setBlockHeight]);

  return (
    <>
      <NavBar city={props.config.cityName} symbol={props.token.symbol} path={props.path} />
      <h3>{props.token.symbol} Contract</h3>
      <p>Current Stacking Cycle</p>
      <p>Cycle Progress</p>
      <h3>{props.token.symbol} Token</h3>
      <p>Total Supply</p>
      <p>{props.token.symbol} Wallet</p>
      <p>{props.config.cityWallet}</p>
      <hr />
      <NavBackHome />
    </>
  );
}
