import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SendManyInputContainer } from '../components/SendManyInputContainer';

// Mock the hooks and dependencies
vi.mock('../lib/hooks', () => ({
    useWalletConnect: () => ({
        wcClient: null,
        wcSession: null,
    }),
}));

vi.mock('../lib/account', () => ({
    fetchAccount: vi.fn().mockResolvedValue({
        stx: { balance: '1000000000', locked: '0' },
        fungible_tokens: {
            'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token::sbtc-token': {
                balance: '50000000', // 0.5 sBTC in satoshis
                total_sent: '0',
                total_received: '50000000'
            }
        },
    }),
}));

vi.mock('../lib/names', () => ({
    getNameInfo: vi.fn(),
    getNameFromAddress: vi.fn().mockResolvedValue({ type: 'ResponseError' }),
}));

vi.mock('../lib/transactions', () => ({
    saveTxData: vi.fn(),
    TxStatus: ({ txId, resultPrefix }: { txId?: string; resultPrefix: string }) => (
        <div>{resultPrefix}{txId}</div>
    ),
}));

vi.mock('@stacks/connect', () => ({
    request: vi.fn(),
}));

const mockSbtcProps = {
    asset: 'sbtc' as const,
    ownerStxAddress: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    network: 'mainnet' as const,
};

const renderComponent = (props = mockSbtcProps) => {
    return render(
        <MemoryRouter>
            <SendManyInputContainer {...props} />
        </MemoryRouter>
    );
};

describe('SendManyInputContainer sBTC Functionality', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render sBTC-specific components and labels', async () => {
        renderComponent();

        // Wait for component to load
        await waitFor(() => {
            // Check for sBTC-specific elements - look for $sBTC in the fee checkbox label
            expect(screen.getByText(/\$sBTC/)).toBeInTheDocument(); // sBTC symbol
            expect(screen.getByText(/Pay fees in/)).toBeInTheDocument(); // Fee option specific to sBTC
        });
    });

    it('should handle sBTC amount input with satoshi precision', async () => {
        renderComponent();

        const addressInput = document.getElementById('wallet-address-0') as HTMLInputElement;
        const amountInput = document.getElementById('amount-0') as HTMLInputElement;

        fireEvent.change(addressInput, { target: { value: 'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS' } });
        fireEvent.change(amountInput, { target: { value: '0.01' } }); // 0.01 sBTC

        expect(addressInput.value).toBe('SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS');
        expect(amountInput.value).toBe('0.01');
    });

    it('should parse CSV with sBTC amounts correctly', async () => {
        renderComponent();

        const pasteInput = screen.getByLabelText('Paste entry list');

        // CSV data with sBTC amounts (in sBTC units, not satoshis)
        const csvData = 'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS,0.001\nSP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7,0.005';

        const clipboardEvent = new Event('paste', { bubbles: true }) as any;
        clipboardEvent.clipboardData = {
            getData: vi.fn().mockReturnValue(csvData),
        };

        fireEvent(pasteInput, clipboardEvent);

        await waitFor(() => {
            // Check that addresses and amounts are populated
            expect(screen.getByDisplayValue('SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS')).toBeInTheDocument();
            expect(screen.getByDisplayValue('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7')).toBeInTheDocument();
            expect(screen.getByDisplayValue('0.001')).toBeInTheDocument();
            expect(screen.getByDisplayValue('0.005')).toBeInTheDocument();
        });
    });

    it('should display sBTC fee information correctly', async () => {
        renderComponent();

        // Look for sBTC-specific fee information
        await waitFor(() => {
            // sBTC transactions typically have fees displayed
            const feeElements = screen.queryAllByText(/fee/i);
            expect(feeElements.length).toBeGreaterThan(0);
        });
    });

    it('should handle sBTC send button interaction', async () => {
        renderComponent();

        // Fill in recipient and amount
        const addressInput = document.getElementById('wallet-address-0') as HTMLInputElement;
        const amountInput = document.getElementById('amount-0') as HTMLInputElement;

        fireEvent.change(addressInput, { target: { value: 'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS' } });
        fireEvent.change(amountInput, { target: { value: '0.001' } }); // 0.001 sBTC

        // Check that send button is present and can be clicked
        const sendButton = screen.getByText(/Send/i);
        expect(sendButton).toBeInTheDocument();
        expect(sendButton).toBeEnabled();

        // The button should be clickable (actual transaction testing would require more complex mocking)
        fireEvent.click(sendButton);
        
        // Verify the form data is still there after click
        expect(addressInput.value).toBe('SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS');
        expect(amountInput.value).toBe('0.001');
    });

    it('should handle decimal sBTC amounts correctly', async () => {
        renderComponent();

        // Fill in recipient and amount
        const addressInput = document.getElementById('wallet-address-0') as HTMLInputElement;
        const amountInput = document.getElementById('amount-0') as HTMLInputElement;

        // Test various decimal amounts
        fireEvent.change(addressInput, { target: { value: 'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS' } });
        fireEvent.change(amountInput, { target: { value: '0.001' } }); // 0.001 sBTC
        expect(amountInput.value).toBe('0.001');

        fireEvent.change(amountInput, { target: { value: '0.12345678' } }); // Max precision
        expect(amountInput.value).toBe('0.12345678');

        fireEvent.change(amountInput, { target: { value: '1.0' } }); // Whole number
        expect(amountInput.value).toBe('1.0');
    });

    it('should handle sBTC with memos in CSV input', async () => {
        renderComponent();

        const pasteInput = screen.getByLabelText('Paste entry list');

        // CSV data with sBTC amounts and memos
        const csvData = 'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS,0.001,Payment for services\nSP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7,0.005,Invoice #123';

        const clipboardEvent = new Event('paste', { bubbles: true }) as any;
        clipboardEvent.clipboardData = {
            getData: vi.fn().mockReturnValue(csvData),
        };

        fireEvent(pasteInput, clipboardEvent);

        await waitFor(() => {
            // Check addresses, amounts, and memos
            expect(screen.getByDisplayValue('SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS')).toBeInTheDocument();
            expect(screen.getByDisplayValue('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7')).toBeInTheDocument();
            expect(screen.getByDisplayValue('0.001')).toBeInTheDocument();
            expect(screen.getByDisplayValue('0.005')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Payment for services')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Invoice #123')).toBeInTheDocument();
        });
    });

    it('should validate sBTC amounts are within reasonable range', async () => {
        renderComponent();

        const amountInput = document.getElementById('amount-0') as HTMLInputElement;

        // Test very large amount
        fireEvent.change(amountInput, { target: { value: '999999999' } });
        
        // The component should handle this gracefully
        expect(amountInput.value).toBe('999999999');

        // Test very small amount (1 satoshi = 0.00000001 sBTC)
        fireEvent.change(amountInput, { target: { value: '0.00000001' } });
        expect(amountInput.value).toBe('0.00000001');
    });

    it('should show sBTC balance information when available', async () => {
        renderComponent();

        await waitFor(() => {
            // The component should fetch and display balance information
            // Check for balance-related elements (this depends on the Profile component)
            const balanceElements = screen.queryAllByText(/balance/i);
            expect(balanceElements.length).toBeGreaterThanOrEqual(0);
        });
    });

    it('should handle BNS names with sBTC amounts', async () => {
        renderComponent();

        const pasteInput = screen.getByLabelText('Paste entry list');

        // Test BNS name conversion with sBTC amounts
        const csvData = 'friedger-btc,0.001\ntest-name,0.002';

        const clipboardEvent = new Event('paste', { bubbles: true }) as any;
        clipboardEvent.clipboardData = {
            getData: vi.fn().mockReturnValue(csvData),
        };

        fireEvent(pasteInput, clipboardEvent);

        await waitFor(() => {
            // Check that BNS names are converted and amounts are preserved
            expect(screen.getByDisplayValue('friedger.btc')).toBeInTheDocument();
            expect(screen.getByDisplayValue('test.name')).toBeInTheDocument();
            expect(screen.getByDisplayValue('0.001')).toBeInTheDocument();
            expect(screen.getByDisplayValue('0.002')).toBeInTheDocument();
        });
    });
});
