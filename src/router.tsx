import React from 'react';
import { Outlet, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { SUPPORTED_SYMBOLS } from './lib/constants';
import { useStxAddresses } from './lib/hooks';
import FulfillmentSBtc from './pages/FulfillmentSBtc';
import Landing from './pages/Landing';
import SendMany from './pages/SendMany';
import SendManyAdvocates from './pages/SendManyAdvocates';
import SendManyCyclePayout from './pages/SendManyCyclePayout';
import SendManyDetails from './pages/SendManyDetails';
import SendManyLisaVault from './pages/SendManyLisaVault';
import SendManyTransferDetails from './pages/SendManyTransferDetails';
function RequireAuth({ children }: { children: JSX.Element | JSX.Element[] }) {
  const { ownerStxAddress } = useStxAddresses();

  if (!ownerStxAddress) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Landing />;
  }

  return children;
}
function AppBody(props: React.PropsWithChildren) {
  return (
    <div>
      <Outlet />
    </div>
  );
}
function createRouter() {
  // const { ownerStxAddress } = useStxAddresses();
  // const { wcSession } = useWalletConnect();
  // const { client, isWcReady } = useWcConnect();
  // const { userSession } = useConnect();

  // console.log({ ownerStxAddress, wcSession, client, wcReady: isWcReady() });
  return createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<AppBody />}>
        {SUPPORTED_SYMBOLS.map(asset => {
          return (
            <Route
              path={asset === 'stx' ? '/' : `/${asset}`}
              element={
                <RequireAuth>
                  <SendMany asset={asset} />
                </RequireAuth>
              }
            />
          );
        })}

        <Route
          path="/sbtc-bridge/:assetContract/:sendManyContract"
          element={
            <RequireAuth>
              <FulfillmentSBtc />
            </RequireAuth>
          }
        />
        <Route path="/landing/:asset?" element={<Landing />} />
        <Route path="/lisa-vault" element={<SendManyLisaVault />} />
        <Route path="/cycle/:cycleId" element={<SendManyCyclePayout />} />
        <Route path="/advocates/:payoutId" element={<SendManyAdvocates />} />
        <Route path="/txid/:txId" element={<SendManyDetails />} />
        <Route path="/txid/:txId/:eventIndex" element={<SendManyTransferDetails />} />
      </Route>
    )
  );
}
export const router = createRouter();
