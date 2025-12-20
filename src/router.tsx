import { isConnected } from '@stacks/connect';
import {
  Navigate,
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  useLocation,
} from 'react-router-dom';
import { SUPPORTED_SYMBOLS } from './lib/constants';
import Landing from './pages/Landing';
import SendMany from './pages/SendMany';
import SendManyCyclePayout from './pages/SendManyCyclePayout';
import SendManyDetails from './pages/SendManyDetails';
import SendManyLisaVault from './pages/SendManyLisaVault';
import SendManyTransferDetails from './pages/SendManyTransferDetails';
import { Rate } from './components/Rate';
import { Network } from './components/Network';
import Auth from './components/Auth';
import metaverse from './styles/metaverse.png';
import { Fragment } from 'react/jsx-runtime';

const styles = {
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundImage: `url(${metaverse})`,
};

function RequireAuth({ children }: { children: React.JSX.Element | React.JSX.Element[] }) {
  const location = useLocation();

  if (!isConnected()) {
    // Redirect to landing page when not authenticated, saving the intended destination
    return <Navigate to="/landing" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
function AppBody(props: React.PropsWithChildren) {
  return (
    <>
      <Fragment>
        <nav className="navbar sticky-top navbar-dark text-light p-2" style={styles}>
          <a className="navbar-brand" href="/">
            <img src="/stacks.png" width="100" alt="Logo" />
          </a>
          <h1>Send Many</h1>
          <div className="d-flex d-sm-block justify-content-xs-around">
            <Rate />
            <Network />
            <Auth />
          </div>
        </nav>
      </Fragment>
      <div>
        <Outlet />
      </div>
    </>
  );
}
function createRouter() {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<AppBody />}>
        {/* Landing page routes */}
        <Route path="/landing/:asset?" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />

        {/* Protected routes */}
        {SUPPORTED_SYMBOLS.map((asset, index) => {
          return (
            <Route
              path={asset === 'stx' ? '/' : `/${asset}`}
              key={index}
              element={
                <RequireAuth>
                  <SendMany asset={asset} />
                </RequireAuth>
              }
            />
          );
        })}

        <Route
          path="/lisa-vault"
          element={
            <RequireAuth>
              <SendManyLisaVault />
            </RequireAuth>
          }
        />
        <Route
          path="/cycle/:cycleId"
          element={
            <RequireAuth>
              <SendManyCyclePayout />
            </RequireAuth>
          }
        />
        <Route
          path="/txid/:txId"
          element={
            <RequireAuth>
              <SendManyDetails />
            </RequireAuth>
          }
        />
        <Route
          path="/txid/:txId/:eventIndex"
          element={
            <RequireAuth>
              <SendManyTransferDetails />
            </RequireAuth>
          }
        />
      </Route>
    )
  );
}
export const router = createRouter();
