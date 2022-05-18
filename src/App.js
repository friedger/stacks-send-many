import { Connect } from '@stacks/connect-react';
import { Router } from '@reach/router';
import { useConnect } from './lib/auth';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import HeaderLogo from './components/layout/HeaderLogo';
import HeaderTitle from './components/layout/HeaderTitle';
import CityMenu from './components/layout/CityMenu';
import HeaderAuth from './components/layout/HeaderAuth';
import Footer from './components/layout/Footer';
import Activation from './pages/CityActivation';
import Dashboard from './pages/CityDashboard';
import Mining from './pages/CityMining';
import Stacking from './pages/CityStacking';
import Tools from './pages/CityTools';
import { useAtom } from 'jotai';
import { cityInfo, currentCity, currentRewardCycle } from './store/cities';
import { useUpdateAtom } from 'jotai/utils';
import { currentBlockHeight } from './store/stacks';
import { useEffect } from 'react';
import { getBlockHeight } from './lib/stacks';
import { getRewardCycle } from './lib/citycoins';
import { sleep } from './lib/common';

export default function App() {
  const { authOptions } = useConnect();
  const [current] = useAtom(currentCity);
  const [info] = useAtom(cityInfo);

  return (
    <Connect authOptions={authOptions}>
      <div className="container mt-3">
        <div
          className="row align-items-center justify-content-between text-center py-3"
          style={
            current !== ''
              ? { backgroundSize: 'cover', backgroundImage: `url(${info[current].background})` }
              : { backgroundImage: 'none' }
          }
        >
          <div className="col-md-3 text-md-center pb-3 pb-md-0">
            <HeaderLogo />
          </div>
          <div className="col-md-6 text-md-center pb-3 pb-md-0">
            <HeaderTitle />
          </div>
          <div className="col-md-3 text-md-end text-nowrap pb-3 pb-md-0">
            <HeaderAuth />
          </div>
        </div>
        <hr className="cc-divider" />
        <div className="row align-items-center">
          <div className="col">
            <CityMenu menuName="topnav" />
          </div>
        </div>
        <hr className="cc-divider" />
        <div className="row align-items-center">
          <div className="col">
            <Content />
          </div>
        </div>
        <hr className="cc-divider" />
        <div className="row align-items-center">
          <div className="col">
            <CityMenu menuName="bottomnav" />
          </div>
        </div>
      </div>
      <Footer />
    </Connect>
  );
}

function Content() {
  const [city] = useAtom(currentCity);
  const [info] = useAtom(cityInfo);
  const setBlockHeight = useUpdateAtom(currentBlockHeight);
  const setRewardCycle = useUpdateAtom(currentRewardCycle);

  useEffect(() => {
    const updatePage = async () => {
      const blockHeight = await getBlockHeight();
      setBlockHeight(blockHeight);
      if (city !== '') {
        const rewardCycle = await getRewardCycle(info[city].currentVersion, city);
        setRewardCycle(rewardCycle);
      }
      await sleep(1000 * 60); // 60 seconds
    };
    updatePage();
  });

  return (
    <Router>
      <Landing path="/" exact />
      <Activation path="/activation" />
      <Dashboard path="/dashboard" />
      <Mining path="/mining" />
      <Stacking path="/stacking" />
      <Tools path="/tools" />
      <NotFound default />
    </Router>
  );
}
