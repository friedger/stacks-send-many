import { OperationResponse } from '@stacks/blockchain-api-client';

// Extract the transaction response type from the API
export type TransactionResponse = OperationResponse['/extended/v1/tx/{tx_id}'];

// Extract the events array type from the union types that have events
export type TransactionWithEvents = Extract<TransactionResponse, { events: any[] }>;

// Extract the individual event type from the events array
export type TransactionEvent = TransactionWithEvents['events'][number];

// Extract specific event types
export type TransactionEventStxAsset = Extract<TransactionEvent, { event_type: 'stx_asset' }>;

// Extract specific event types
export type TransactionEventSmartContractLog = Extract<
  TransactionEvent,
  { event_type: 'smart_contract_log' }
>;

export type TransactionEventFungibleAsset = Extract<
  TransactionEvent,
  { event_type: 'fungible_token_asset' }
>;

export type TransactionEventStxLock = Extract<TransactionEvent, { event_type: 'stx_lock' }>;

// Extract transaction status types
export type TransactionStatus = Transaction['tx_status'];
export type ConfirmedTransactionStatus =
  | 'success'
  | 'abort_by_response'
  | 'abort_by_post_condition';
export type MempoolTransactionStatus = Exclude<TransactionStatus, ConfirmedTransactionStatus>;

// Transaction type from the API response
export type Transaction = TransactionResponse;
export type ContractCallTransaction = Extract<TransactionWithEvents, { tx_type: 'contract_call' }>;
// Extract the proper return type from the API schema
export type AccountBalanceResponse = OperationResponse['/extended/v1/address/{principal}/balances'];
