import { isConnected } from '@stacks/connect';
import React from 'react';
import { Navigate, Outlet, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { SUPPORTED_SYMBOLS } from './lib/constants';
import Landing from './pages/Landing';
import SendMany from './pages/SendMany';
import SendManyCyclePayout from './pages/SendManyCyclePayout';
import SendManyDetails from './pages/SendManyDetails';
import SendManyLisaVault from './pages/SendManyLisaVault';
import SendManyTransferDetails from './pages/SendManyTransferDetails';

function RequireAuth({ children }: { children: JSX.Element | JSX.Element[] }) {
  if (!isConnected()) {
    // Redirect to landing page when not authenticated
    return <Navigate to="/landing" replace />;
  }

  return <>{children}</>;
}
function AppBody(props: React.PropsWithChildren) {
  return (
    <div>
      <Outlet />
    </div>
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
