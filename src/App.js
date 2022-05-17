import { Connect } from '@stacks/connect-react';
import { Router } from '@reach/router';
import { useConnect } from './lib/auth';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import HeaderLogo from './components/layout/HeaderLogo';
import HeaderTitle from './components/layout/HeaderTitle';
import HeaderNav from './components/layout/HeaderNav';
import HeaderAuth from './components/layout/HeaderAuth';
import Footer from './components/layout/Footer';
import Activation from './pages/CityActivation';
import Dashboard from './pages/CityDashboard';
import Mining from './pages/CityMining';
import Stacking from './pages/CityStacking';
import Tools from './pages/CityTools';

export default function App() {
  const { authOptions } = useConnect();

  return (
    <Connect authOptions={authOptions}>
      <div className="container mt-3">
        <div className="row align-items-center justify-content-between text-center mb-3">
          <div className="col-md-4 text-md-start pb-3 pb-md-0">
            <HeaderLogo />
          </div>
          <div className="col-md-4 text-md-center pb-3 pb-md-0">
            <HeaderTitle />
          </div>
          <div className="col-md-4 text-md-end text-nowrap pb-3 pb-md-0">
            <HeaderAuth />
          </div>
        </div>
        <hr className="cc-divider" />
        <div className="row align-items-center">
          <div className="col">
            <HeaderNav />
          </div>
        </div>
        <hr className="cc-divider" />
        <div className="row align-items-center">
          <div className="col">
            <Content />
          </div>
        </div>
      </div>
      <Footer />
    </Connect>
  );
}

function Content() {
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

// if no city selected, return landing
// if action selected, display action
// set action to dashboard, display dashboard
