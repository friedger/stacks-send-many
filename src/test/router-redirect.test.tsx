import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Landing from '../pages/Landing';
import SendMany from '../pages/SendMany';

// Mock @stacks/connect
let mockIsConnected = false;
vi.mock('@stacks/connect', () => ({
  isConnected: () => mockIsConnected,
  connect: vi.fn(() => {
    mockIsConnected = true;
    return Promise.resolve();
  }),
}));

// Mock the hooks and dependencies
vi.mock('../lib/hooks', () => ({
  useWalletConnect: () => ({
    wcClient: null,
    wcSession: null,
  }),
  useStxAddresses: () => ({
    ownerStxAddress: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  }),
}));

vi.mock('../lib/auth', () => ({
  useWcConnect: () => ({
    handleWcOpenAuth: vi.fn(() => Promise.resolve()),
    isWcReady: () => false,
    authenticated: false,
    client: null,
  }),
}));

vi.mock('../lib/account', () => ({
  fetchAccount: vi.fn().mockResolvedValue({
    stx: { balance: '1000000000', locked: '0' },
    fungible_tokens: {},
  }),
}));

vi.mock('../lib/names', () => ({
  getNameInfo: vi.fn(),
  getNameFromAddress: vi.fn(() => Promise.resolve(undefined)),
}));

vi.mock('../lib/transactions', () => ({
  saveTxData: vi.fn(),
  TxStatus: ({ txId, resultPrefix }: { txId?: string; resultPrefix: string }) => (
    <div>{resultPrefix}{txId}</div>
  ),
}));

// Helper to render the router
const renderWithRouter = (initialPath: string) => {
  // Create a mock RequireAuth component that mimics the real one
  const RequireAuth = ({ children }: { children: React.JSX.Element }) => {
    const { Navigate, useLocation } = require('react-router-dom');
    const location = useLocation();
    
    if (!mockIsConnected) {
      return <Navigate to="/landing" replace state={{ from: location }} />;
    }
    
    return children;
  };

  const router = createMemoryRouter(
    [
      {
        path: '/landing',
        element: <Landing />,
      },
      {
        path: '/usdh',
        element: (
          <RequireAuth>
            <SendMany asset="usdh" />
          </RequireAuth>
        ),
      },
    ],
    {
      initialEntries: [initialPath],
      initialIndex: 0,
    }
  );

  return render(<RouterProvider router={router} />);
};

describe('Router Redirect Flow', () => {
  beforeEach(() => {
    mockIsConnected = false;
    vi.clearAllMocks();
  });

  it('should redirect unauthenticated user from /usdh to /landing and back after authentication', async () => {
    // User is not connected and tries to access /usdh
    const { rerender } = renderWithRouter('/usdh');

    // Should be redirected to landing page
    await waitFor(() => {
      expect(screen.getByText(/Send Many is an/i)).toBeInTheDocument();
    });

    // Get the "Start now with Stacks Wallet" button
    const connectButton = screen.getByText('Start now with Stacks Wallet');
    expect(connectButton).toBeInTheDocument();

    // Click the connect button
    await act(async () => {
      connectButton.click();
    });

    // After connecting, user should be redirected to /usdh
    await waitFor(() => {
      // The SendMany component should be rendered
      // We can check for elements that are specific to SendMany component
      // Since we're using a simplified mock, we check that we're no longer on landing
      const landingText = screen.queryByText(/Send Many is an/i);
      expect(landingText).not.toBeInTheDocument();
    });
  });

  it('should go to /landing when accessing protected route without authentication', async () => {
    // User is not connected and tries to access /usdh
    renderWithRouter('/usdh');

    // Should be redirected to landing page
    await waitFor(() => {
      expect(screen.getByText(/Send Many is an/i)).toBeInTheDocument();
      expect(screen.getByText('Start now with Stacks Wallet')).toBeInTheDocument();
    });
  });

  it('should not redirect when user is already authenticated', async () => {
    // Set user as authenticated
    mockIsConnected = true;

    // User accesses /usdh while authenticated
    renderWithRouter('/usdh');

    // Should NOT be redirected to landing page
    await waitFor(() => {
      const landingText = screen.queryByText(/Send Many is an/i);
      expect(landingText).not.toBeInTheDocument();
    });
  });
});
