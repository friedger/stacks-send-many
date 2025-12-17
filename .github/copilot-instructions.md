# Stacks Send-Many AI Coding Instructions

## Architecture Overview

This is a React/TypeScript web app for batch sending tokens on the Stacks blockchain. Users can send STX or other fungible tokens to multiple recipients in a single transaction using smart contracts' `send-many` functions.

**Key architectural patterns:**

- **Route-based asset handling**: Each supported token has its own URL path (`/stx`, `/sbtc`, `/not`, etc.)
- **Dual wallet support**: Both Stacks Connect and WalletConnect integration via Jotai state atoms
- **Contract abstraction**: Assets can use native `send-many` functions OR dedicated send-many contracts
- **Type-safe API integration**: All transaction/account types derived from `@stacks/blockchain-api-client` schema

## State Management (Jotai)

Global state uses Jotai atoms in `src/lib/auth.ts`:

- `wcClientState`, `wcSessionState` - WalletConnect client/session
- `userDataState`, `authResponseState` - Stacks Connect auth
- Use `useStxAddresses()` hook for current wallet address

## Essential Patterns

### Asset Configuration (`src/lib/constants.ts`)

Assets are defined in `SUPPORTED_ASSETS` with network-specific contracts:

```typescript
// Each asset can specify either native send-many or custom contract
sendManyContract?: Contract; // Use dedicated send-many contract
// OR rely on token's native send-many function
```

### Transaction Type Safety (`src/lib/types.ts`)

**Always** derive types from API client, never hardcode:

```typescript
// ✅ Correct - extracted from API schema
export type TransactionEvent = TransactionWithEvents['events'][number];
// ❌ Wrong - hardcoded union types
```

### Authentication Flow

- `RequireAuth` component wraps protected routes
- Redirects to `/landing` when `ownerStxAddress` is undefined
- Hook updates address reactively when wallet connects

### Contract Call Construction (`SendManyInputContainer.tsx`)

The app handles 3 contract patterns:

1. **STX**: Uses `send-many` or `send-many-memo` based on memo presence
2. **Native send-many**: Direct token contract calls
3. **Custom send-many contracts**: Wrapper contracts for tokens without native support

## Development Workflows

### Build & Serve

```bash
pnpm start        # Development server
pnpm build        # Production build (TypeScript + Vite)
pnpm serve        # Preview built app
```

### Network Switching

- Add `?chain=testnet` for testnet
- Add `?mocknet=local` for local development
- Configuration auto-detected from URL params

### URL-based Recipient Loading

Support quick-share URLs with pre-filled recipients:

```
/stx?recipient=SP1...MZ,1000,"memo"&recipient=friedger.btc,500
```

## Critical Implementation Details

### Transaction Status Handling

Use type guards from `src/lib/transactions.tsx`:

```typescript
// Safe property access with type guards
if (hasBurnBlockTimeIso(transaction)) {
  const timestamp = transaction.burn_block_time_iso;
}
```

### Local Storage Pattern

Replace Stacks Storage class with localStorage helpers:

```typescript
// Use getTxId(), setTxId() functions instead of Storage class
```

### Contract Function Selection

STX sending logic automatically chooses contract based on memo usage:

- Empty memos → `send-many` contract
- Any memos → `send-many-memo` contract

### Error Boundaries

Transaction failures are handled at component level with loading states and user-friendly error messages. Always provide fallback UI for network/contract errors.

## Testing & Debugging

- Use browser network tab to debug API calls to Stacks blockchain API
- Check `wcSession` and connection state in React DevTools
- Transaction details available at `/txid/{transactionId}` routes
- Use testnet for development to avoid mainnet fees
