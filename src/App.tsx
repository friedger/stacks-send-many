import { Connect } from '@stacks/connect-react';
import Client from '@walletconnect/sign-client';
import { useAtom, useSetAtom } from 'jotai';
import React, { useEffect } from 'react';
import Auth from './components/Auth';
import { Network } from './components/Network';
import { Rate } from './components/Rate';
import { appMetaData, useConnect, userDataState, wcClientState } from './lib/auth';
import { useStxAddresses } from './lib/hooks';
import FulfillmentSBtc from './pages/FulfillmentSBtc';
import Landing from './pages/Landing';
import SendMany from './pages/SendMany';
import SendManyAdvocates from './pages/SendManyAdvocates';
import SendManyCyclePayout from './pages/SendManyCyclePayout';
import SendManyDetails from './pages/SendManyDetails';
import SendManyTransferDetails from './pages/SendManyTransferDetails';
import metaverse from './styles/metaverse.png';
import {
  CONTRACT_ADDRESS,
  NOT_CONTRACT,
  SBTC_CONTRACT,
  WMNO_CONTRACT,
  XBTC_SEND_MANY_CONTRACT,
} from './lib/constants';
import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useLocation,
} from 'react-router-dom';

/* global BigInt */
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const styles = {
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundImage: `url(${metaverse})`,
};

const router = createRouter();

export default function App() {
  const { authOptions, userSession } = useConnect();
  const setUserData = useSetAtom(userDataState);
  const [wcClient, setWcClient] = useAtom(wcClientState);
  useEffect(() => {
    if (userSession?.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn();
    }
  }, [userSession, setUserData]);

  useEffect(() => {
    const f = async () => {
      const c = await Client.init({
        logger: 'debug',
        relayUrl: 'wss://relay.walletconnect.com',
        projectId: 'd0c1b8c866cfccbd943f1e06e7d088f4',
        metadata: {
          name: appMetaData.appDetails.name,
          description: appMetaData.description,
          url: appMetaData.url,
          icons: [appMetaData.appDetails.icon],
        },
      });

      setWcClient(c);
    };

    if (wcClient === undefined) {
      f();
    }
  }, [wcClient, setWcClient]);

  return (
    <Connect authOptions={authOptions}>
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

      <RouterProvider router={router} />
    </Connect>
  );
}

function RequireAuth({ children }: { children: JSX.Element | JSX.Element[] }) {
  const { ownerStxAddress } = useStxAddresses();
  let location = useLocation();

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
        <Route
          path="/xbtc"
          element={
            <RequireAuth>
              <SendMany
                asset="xbtc"
                sendManyContract={
                  XBTC_SEND_MANY_CONTRACT.address + '.' + XBTC_SEND_MANY_CONTRACT.name
                }
              />
            </RequireAuth>
          }
        />
        <Route
          path="/wmno"
          element={
            <RequireAuth>
              <SendMany
                asset="wmno"
                sendManyContract={WMNO_CONTRACT.address + '.' + WMNO_CONTRACT.name}
              />
            </RequireAuth>
          }
        />
        <Route
          path="/not"
          element={
            <RequireAuth>
              <SendMany
                asset="not"
                sendManyContract={NOT_CONTRACT.address + '.' + NOT_CONTRACT.name}
              />
            </RequireAuth>
          }
        />
        <Route
          path="/sbtc/:assetContract/:sendManyContract"
          element={
            <RequireAuth>
              <SendMany asset="sbtc" sendManyContract={SBTC_CONTRACT} />
            </RequireAuth>
          }
        />
        <Route
          path="/"
          element={
            <RequireAuth>
              <SendMany asset="stx" sendManyContract={`${CONTRACT_ADDRESS}.send-many-memo`} />
            </RequireAuth>
          }
        />
        <Route
          path="/sbtc-bridge/:assetContract/:sendManyContract"
          element={
            <RequireAuth>
              <FulfillmentSBtc />
            </RequireAuth>
          }
        />

        <Route path="/landing/:asset?" element={<Landing />} />

        <Route path="/cycle/:cycleId" element={<SendManyCyclePayout />} />
        <Route path="/advocates/:payoutId" element={<SendManyAdvocates />} />
        <Route path="/txid/:txId" element={<SendManyDetails />} />
        <Route path="/txid/:txId/:eventIndex" element={<SendManyTransferDetails />} />
      </Route>
    )
  );
}
