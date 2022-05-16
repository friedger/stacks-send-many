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
  return <Landing />;
}

// navigation
// / -> landing page
// /action -> action page
// no city: standard response
// city: load relevant city pages

// two different nav paths
// 1. select a city -> city dashboard
// 2. select an action -> city action
