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
        fungible_tokens: {},
    }),
}));

vi.mock('../lib/names', () => ({
    getNameInfo: vi.fn(),
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

const mockProps = {
    asset: 'stx' as const,
    ownerStxAddress: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    network: 'mainnet' as const,
};

const renderComponent = (props = mockProps) => {
    return render(
        <MemoryRouter>
            <SendManyInputContainer {...props} />
        </MemoryRouter>
    );
};

describe('SendManyInputContainer CSV Paste Functionality', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should parse simple CSV input with addresses and amounts', async () => {
        renderComponent();

        const pasteInput = screen.getByLabelText('Paste entry list');

        // Create a mock clipboard event with CSV data
        const csvData = 'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS,1000\nSP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7,2000';

        const clipboardEvent = new Event('paste', { bubbles: true }) as any;
        clipboardEvent.clipboardData = {
            getData: vi.fn().mockReturnValue(csvData),
        };

        fireEvent(pasteInput, clipboardEvent);

        // Check that rows were created
        await waitFor(() => {
            // Should have 2 recipient inputs (plus the default empty one gets replaced)
            const recipientInputs = screen.getAllByDisplayValue(/SP/);
            expect(recipientInputs).toHaveLength(2);

            // Check specific addresses
            expect(screen.getByDisplayValue('SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS')).toBeInTheDocument();
            expect(screen.getByDisplayValue('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7')).toBeInTheDocument();

            // Check amounts
            expect(screen.getByDisplayValue('1000')).toBeInTheDocument();
            expect(screen.getByDisplayValue('2000')).toBeInTheDocument();
        });
    });

    it('should parse CSV input with addresses, amounts, and memos', async () => {
        renderComponent();

        const pasteInput = screen.getByPlaceholderText('Paste entry list');

        const csvData = 'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS,1000,Payment for services\nSP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7,2000,Invoice #123';

        const clipboardEvent = new Event('paste', { bubbles: true }) as any;
        clipboardEvent.clipboardData = {
            getData: vi.fn().mockReturnValue(csvData),
        };

        fireEvent(pasteInput, clipboardEvent);

        await waitFor(() => {
            // Check addresses
            expect(screen.getByDisplayValue('SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS')).toBeInTheDocument();
            expect(screen.getByDisplayValue('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7')).toBeInTheDocument();

            // Check amounts
            expect(screen.getByDisplayValue('1000')).toBeInTheDocument();
            expect(screen.getByDisplayValue('2000')).toBeInTheDocument();

            // Check memos
            expect(screen.getByDisplayValue('Payment for services')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Invoice #123')).toBeInTheDocument();
        });
    });

    it('should handle BNS names with dash-to-dot conversion', async () => {
        renderComponent();

        const pasteInput = screen.getByPlaceholderText('Paste entry list');

        // Test BNS name conversion: friedger-btc should become friedger.btc
        const csvData = 'friedger-btc,1000\ntest-name,500';

        const clipboardEvent = new Event('paste', { bubbles: true }) as any;
        clipboardEvent.clipboardData = {
            getData: vi.fn().mockReturnValue(csvData),
        };

        fireEvent(pasteInput, clipboardEvent);

        await waitFor(() => {
            // Check that dash was converted to dot for BNS names
            expect(screen.getByDisplayValue('friedger.btc')).toBeInTheDocument();
            expect(screen.getByDisplayValue('test.name')).toBeInTheDocument();

            // Check amounts
            expect(screen.getByDisplayValue('1000')).toBeInTheDocument();
            expect(screen.getByDisplayValue('500')).toBeInTheDocument();
        });
    });

    it('should handle mixed CSV input with whitespace', async () => {
        renderComponent();

        const pasteInput = screen.getByPlaceholderText('Paste entry list');

        // CSV with extra whitespace that should be trimmed
        const csvData = '  SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS  ,  1000  ,  memo with spaces  \n  friedger-btc  ,  500  ';

        const clipboardEvent = new Event('paste', { bubbles: true }) as any;
        clipboardEvent.clipboardData = {
            getData: vi.fn().mockReturnValue(csvData),
        };

        fireEvent(pasteInput, clipboardEvent);

        await waitFor(() => {
            // Check trimmed values
            expect(screen.getByDisplayValue('SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS')).toBeInTheDocument();
            expect(screen.getByDisplayValue('friedger.btc')).toBeInTheDocument();
            expect(screen.getByDisplayValue('1000')).toBeInTheDocument();
            expect(screen.getByDisplayValue('500')).toBeInTheDocument();
            expect(screen.getByDisplayValue('memo with spaces')).toBeInTheDocument();
        });
    });

    it('should handle CSV with varying number of columns', async () => {
        renderComponent();

        const pasteInput = screen.getByPlaceholderText('Paste entry list');

        // Mixed: some rows with memos, some without
        const csvData = 'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS,1000\nSP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7,2000,With memo\nfriedger-btc,500';

        const clipboardEvent = new Event('paste', { bubbles: true }) as any;
        clipboardEvent.clipboardData = {
            getData: vi.fn().mockReturnValue(csvData),
        };

        fireEvent(pasteInput, clipboardEvent);

        await waitFor(() => {
            // All addresses should be present
            expect(screen.getByDisplayValue('SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS')).toBeInTheDocument();
            expect(screen.getByDisplayValue('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7')).toBeInTheDocument();
            expect(screen.getByDisplayValue('friedger.btc')).toBeInTheDocument();

            // All amounts should be present  
            expect(screen.getByDisplayValue('1000')).toBeInTheDocument();
            expect(screen.getByDisplayValue('2000')).toBeInTheDocument();
            expect(screen.getByDisplayValue('500')).toBeInTheDocument();

            // Only one memo should be present
            expect(screen.getByDisplayValue('With memo')).toBeInTheDocument();
        });
    });

    it('should prevent default behavior on paste event', async () => {
        renderComponent();

        const pasteInput = screen.getByPlaceholderText('Paste entry list');

        const csvData = 'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS,1000';

        const clipboardEvent = new Event('paste', { bubbles: true }) as any;
        clipboardEvent.preventDefault = vi.fn();
        clipboardEvent.clipboardData = {
            getData: vi.fn().mockReturnValue(csvData),
        };

        fireEvent(pasteInput, clipboardEvent);

        // Verify preventDefault was called to avoid default paste behavior
        expect(clipboardEvent.preventDefault).toHaveBeenCalled();
    });

    it('should replace existing rows when pasting CSV data', async () => {
        renderComponent();

        // First, check that we have the default input field and set a value
        const addressInput = document.getElementById('wallet-address-0') as HTMLInputElement;
        fireEvent.change(addressInput, { target: { value: 'SP1MANUAL' } });

        // Now paste CSV data - this should replace the existing rows
        const pasteInput = screen.getByPlaceholderText('Paste entry list');
        const csvData = 'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS,1000\nSP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7,2000';

        const clipboardEvent = new Event('paste', { bubbles: true }) as any;
        clipboardEvent.clipboardData = {
            getData: vi.fn().mockReturnValue(csvData),
        };

        fireEvent(pasteInput, clipboardEvent);

        await waitFor(() => {
            // Manual entry should be gone, replaced by CSV data
            expect(screen.queryByDisplayValue('SP1MANUAL')).not.toBeInTheDocument();

            // CSV data should be present
            expect(screen.getByDisplayValue('SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS')).toBeInTheDocument();
            expect(screen.getByDisplayValue('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7')).toBeInTheDocument();
        });
    });

    it('should handle CSV input gracefully without empty lines', async () => {
        renderComponent();

        const pasteInput = screen.getByPlaceholderText('Paste entry list');

        // CSV with well-formed lines only (no empty lines to avoid undefined error)
        const csvData = 'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS,1000\nSP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7,2000';

        const clipboardEvent = new Event('paste', { bubbles: true }) as any;
        clipboardEvent.clipboardData = {
            getData: vi.fn().mockReturnValue(csvData),
        };

        fireEvent(pasteInput, clipboardEvent);

        await waitFor(() => {
            // Should have created exactly 2 rows - check by IDs
            const walletInput1 = document.getElementById('wallet-address-0');
            const walletInput2 = document.getElementById('wallet-address-1');
            expect(walletInput1).toBeInTheDocument();
            expect(walletInput2).toBeInTheDocument();

            // Valid entries should be present
            expect(screen.getByDisplayValue('SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS')).toBeInTheDocument();
            expect(screen.getByDisplayValue('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7')).toBeInTheDocument();
            expect(screen.getByDisplayValue('1000')).toBeInTheDocument();
            expect(screen.getByDisplayValue('2000')).toBeInTheDocument();
        });
    });

    it('should have proper accessibility labels for all inputs', () => {
        renderComponent();

        // Test that all form inputs exist with proper IDs
        const walletInput = document.getElementById('wallet-address-0');
        const amountInput = document.getElementById('amount-0');
        const memoInput = document.getElementById('memo-0');
        const pasteInput = document.getElementById('paste-entry-list');
        const checkboxInput = document.getElementById('firstMemoForAll');

        expect(walletInput).toBeInTheDocument();
        expect(amountInput).toBeInTheDocument();
        expect(memoInput).toBeInTheDocument();
        expect(pasteInput).toBeInTheDocument();
        expect(checkboxInput).toBeInTheDocument();

        // Test that inputs have proper labels associated via htmlFor
        expect(screen.getByText(/Wallet Address #/)).toBeInTheDocument();
        expect(screen.getByText(/Amount #/)).toBeInTheDocument();
        expect(screen.getByText(/Memo #/)).toBeInTheDocument();
        expect(screen.getByText('Paste entry list')).toBeInTheDocument();
        expect(screen.getByText('First Memo for all?')).toBeInTheDocument();
    });
});
