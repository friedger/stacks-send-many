
import { connectWebSocketClient, OperationResponse } from '@stacks/blockchain-api-client';
import { FinishedTxData } from '@stacks/connect';
import { hexToCV as stacksHexToCV } from '@stacks/transactions';
import { useEffect, useState } from 'react';
import {
  STACKS_API_WS_URL,
  STACK_API_URL,
  chainSuffix,
  mainnet,
  mocknet,
  testnet,
  transactionsApi,
} from './constants';
import { ConfirmedTransactionStatus, MempoolTransactionStatus, Transaction, TransactionEvent, TransactionEventStxAsset, TransactionStatus, TransactionWithEvents } from './types';


// Create runtime array from the derived type using a type-safe approach
const confirmedStatuses: readonly ConfirmedTransactionStatus[] = [
  'success',
  'abort_by_response',
  'abort_by_post_condition'
] as const;

// Function to get mempool statuses dynamically (for runtime iteration)
function getMempoolStatuses(): MempoolTransactionStatus[] {
  // This ensures if new statuses are added to the library, they will be included
  const allPossibleStatuses: TransactionStatus[] = [
    'success',
    'abort_by_response',
    'abort_by_post_condition',
    'pending',
    'dropped_replace_by_fee',
    'dropped_replace_across_fork',
    'dropped_too_expensive',
    'dropped_stale_garbage_collect',
    'dropped_problematic'
  ];

  return allPossibleStatuses.filter(
    (status): status is MempoolTransactionStatus =>
      !confirmedStatuses.includes(status as ConfirmedTransactionStatus)
  );
}

// Use the derived statuses for runtime checks
const mempoolStatuses = getMempoolStatuses();

// Local storage helper functions to replace Stacks Storage
const getLocalStorageKey = (stxAddress: string, filename: string) => {
  return `stacks-send-many-${stxAddress}-${filename}`;
};

const getFromLocalStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.log('Error reading from localStorage:', e);
    return null;
  }
};

const setInLocalStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.log('Error writing to localStorage:', e);
  }
};

interface Subscription {
  unsubscribe(): Promise<void>;
}

export type StoredTx = {
  data: {
    txId: string;
  };
  apiData?: Transaction | TransactionWithEvents;
};
// export function resultToStatus(result) {
//   if (result && !result.error && result.startsWith('"') && result.length === 66) {
//     const txId = result.substr(1, 64);
//     return txIdToStatus(txId);
//   } else if (result && result.error) {
//     return jsonStringify(result);
//   } else {
//     return result.toString();
//   }
// }

export function txIdToStatus(txId: string) {
  return (
    <>
      Check transaction status: <a href={txUrl(txId)}>{txId}</a>
    </>
  );
}

// export function cvToHex(value: ClarityValue) {
//   return `0x${serializeCV(value).toString('hex')}`;
// }

export function hexToCV(hexString: string) {
  return stacksHexToCV(hexString);
}

export function txUrl(txId: string) {
  if (mocknet) {
    return `${STACK_API_URL}/extended/v1/tx/0x${txId}`;
  } else {
    return `https://explorer.hiro.so/txid/0x${txId}${chainSuffix}`;
  }
}

export function jsonStringify(data: object) {
  return JSON.stringify(data, (_, value) => (typeof value === 'bigint' ? value.toString() : value));
}

const indexFileName = mainnet
  ? 'index-mainnet.json'
  : testnet
    ? 'index-testnet.json'
    : 'index-mocknet.json';

export async function saveTxData(
  data: Pick<FinishedTxData, 'txId'> & Partial<FinishedTxData>,
  stxAddress: string
) {
  console.log(jsonStringify(data));
  const indexKey = getLocalStorageKey(stxAddress, indexFileName);
  const txKey = getLocalStorageKey(stxAddress, `txs/${data.txId}.json`);

  let indexArray;
  try {
    const indexFile = getFromLocalStorage(indexKey);
    if (typeof indexFile === 'string') {
      indexArray = JSON.parse(indexFile);
    }
  } catch (e) {
    console.log(e);
    indexArray = [];
  }
  indexArray.push(data.txId);
  setInLocalStorage(indexKey, jsonStringify(indexArray));
  setInLocalStorage(txKey, jsonStringify({ data }));
}

export async function getTxs(stxAddress: string) {
  const indexKey = getLocalStorageKey(stxAddress, indexFileName);

  let indexArray;
  const txs: StoredTx[] = [];
  try {
    let indexFile;
    indexFile = getFromLocalStorage(indexKey);
    console.log({ indexFile });
    indexArray = JSON.parse(indexFile as string);
    for (let txId of indexArray) {
      const tx = await getTxWithLocalStorage(txId, stxAddress);
      if (tx) {
        txs.push(tx);
      }
    }
    return txs;
  } catch (e) {
    console.log(e);
    return txs;
  }
}
type TxFilter = (value: StoredTx) => boolean;
export async function getTxsAsCSV(stxAddress: string, filter: TxFilter) {
  const txs = await getTxs(stxAddress);
  const txsAsCSV = txs
    .filter(tx => tx.apiData && tx.apiData.tx_status === 'success')
    .filter(filter)
    .reduce((result, tx) => {
      // casting to confirmed since it's checked anyway ⬆️
      const txData = tx.apiData as TransactionWithEvents;
      const stxEvents = (txData.events || []).filter(
        e => e.event_type === 'stx_asset'
      ) as TransactionEventStxAsset[];

      return (
        result +
        stxEvents
          .filter(e => e.event_type === 'stx_asset')
          .reduce((eventResult, e) => {
            return (
              eventResult +
              `${e.asset.recipient}, ${Number(e.asset.amount || 0) / 1000000}, ${txData.burn_block_time_iso
              }, https://explorer.hiro.so/txid/${txData.tx_id
              }, https://stacks-send-many.pages.dev/txid/${txData.tx_id}${chainSuffix}\n`
            );
          }, '')
      );
    }, 'recipient, amount, timestamp, explorer_url, send_many_url\n');
  return txsAsCSV;
}

export async function getTxsAsJSON(stxAddress: string, filter: TxFilter) {
  type jsonTx = {
    recipient: string;
    amount: number;
    timestamp: string;
    explorer_url: string;
    send_many_url: string;
  };
  const txs = await getTxs(stxAddress);
  const txsAsJSON = txs
    .filter(tx => tx.apiData && tx.apiData.tx_status === 'success')
    .filter(filter)
    .reduce((result, tx) => {
      const txData = tx.apiData as TransactionWithEvents;
      const stxEvents = txData.events.filter(
        e => e.event_type === 'stx_asset'
      ) as TransactionEventStxAsset[];

      return result.concat(
        stxEvents.map(e => {
          const exportedTx = {
            recipient: e.asset.recipient as string,
            amount: Number(e.asset.amount || 0) / 1000000,
            timestamp: txData.burn_block_time_iso,
            explorer_url: `https://explorer.hiro.so/txid/${txData.tx_id}${chainSuffix}`,
            send_many_url: `https://stacks-send-many.pages.dev/txid/${txData.tx_id}`,
          };
          return exportedTx;
        })
      );
    }, [] as jsonTx[]);
  return txsAsJSON;
}

async function getTxWithLocalStorage(txId: string, stxAddress: string): Promise<StoredTx> {
  try {
    const txKey = getLocalStorageKey(stxAddress, `txs/${txId}.json`);
    const txFile = getFromLocalStorage(txKey);
    let tx: StoredTx;
    if (!txFile) {
      throw new Error(`No transaction file for ${txId}.`);
    }

    tx = JSON.parse(txFile as string);
    if (!txFile || !tx.data) {
      tx = { data: { txId } };
    }
    if (!tx.apiData || (tx.apiData as any).tx_status === 'pending') {
      tx = await createTxWithApiData(txId, tx);
    }
    return tx;
  } catch (e) {
    console.log(e);

    return createTxWithApiData(txId, { data: { txId } });
  }
}

async function getTxWithStorage(txId: string) {
  try {
    const txFile = getFromLocalStorage(`txs/${txId}.json`);
    let tx: StoredTx;
    if (!txFile) {
      throw new Error(`No transaction file for ${txId}.`);
    }

    tx = JSON.parse(txFile as string);
    if (!txFile || !tx.data) {
      tx = { data: { txId } };
    }
    if (!tx.apiData || tx.apiData.tx_status === 'pending') {
      tx = await createTxWithApiData(txId, tx);
    }
    return tx;
  } catch (e) {
    console.log(e);

    return createTxWithApiData(txId, { data: { txId } });
  }
}

async function getTxWithoutStorage(txId: string) {
  return createTxWithApiData(txId, { data: { txId } });
}

export async function getTx(txId: string, useCache: boolean = true) {
  if (useCache) {
    return getTxWithStorage(txId);
  } else {
    return getTxWithoutStorage(txId);
  }
}

function joinEvents(allEvents: TransactionEvent[], newEvents: TransactionEvent[]): TransactionEvent[] {
  newEvents.forEach(event => {
    const pos = allEvents.findIndex(e => event.event_index === e.event_index);
    if (pos < 0) {
      allEvents.push(event);
    }
  });
  return allEvents;
}

async function createTxWithApiData(
  txId: string,
  tx: { data: { txId: string } },
): Promise<StoredTx> {

  let eventOffset = 0;
  const eventLimit = 20;
  let events: TransactionEvent[] = [];

  let apiData: OperationResponse["/extended/v1/tx/{tx_id}"];
  let moreEvents = true;
  let lastEventsLength = 0;

  let response = await transactionsApi.GET("/extended/v1/tx/{tx_id}", {
    params: {
      path: {
        tx_id: txId,
      },
      query: {
        unanchored: true,
        event_limit: eventLimit,
        event_offset: eventOffset,
      },
    }
  });
  if (!response || !response.data) {
    return Promise.reject(new Error(`No transaction data for ${txId}.`, { cause: response.error }));
  }

  apiData = response.data as Transaction;

  const isOutOfMempool = mempoolStatuses.includes(apiData?.tx_status as MempoolTransactionStatus);
  if (!isOutOfMempool && apiData.tx_status === 'success') {
    console.log(apiData.events.length, apiData.event_count);
    moreEvents = apiData.events.length < apiData.event_count;

    while (moreEvents) {
      response = await transactionsApi.GET("/extended/v1/tx/{tx_id}", {
        params: {
          path: {
            tx_id: txId,
          },
          query: {
            unanchored: true,
            event_limit: eventLimit,
            event_offset: eventOffset,
          },
        }
      });

      if (!response || !response.data) {
        break;
      }
      apiData = response.data as TransactionWithEvents;

      const data = apiData;
      console.log(eventOffset, data.events.length, apiData.event_count);
      events = joinEvents(events, data.events);
      moreEvents = events.length > lastEventsLength;
      lastEventsLength = events.length;
      eventOffset = lastEventsLength;
      console.log(isOutOfMempool, events.length, apiData.event_count, lastEventsLength);
    }
  }

  (apiData as TransactionWithEvents).events = events;
  const txWithApiData: StoredTx = {
    ...tx,
    apiData,
  };

  if (apiData?.tx_status !== 'pending') {
    // await storage.putFile(`txs/${txId}.json`, jsonStringify(txWithApiData));
    setInLocalStorage(`txs/${txId}.json`, jsonStringify(txWithApiData));
  }
  return txWithApiData;
}

export function TxStatus({ txId, resultPrefix }: { txId?: string; resultPrefix?: string }) {
  const [processingResult, setProcessingResult] = useState<{
    loading: boolean;
    result?: { repr: string; hex: string } | undefined;
  }>({ loading: false });

  useEffect(() => {
    if (!txId) {
      return;
    }
    console.log(txId);
    setProcessingResult({ loading: true });

    let sub: Subscription;
    const subscribe = async (
      txId: string,
      update: (event: Transaction) => void
    ) => {
      try {
        const client = await connectWebSocketClient(STACKS_API_WS_URL);
        sub = await client.subscribeTxUpdates(txId, update);
        console.log({ client, sub });
      } catch (e) {
        console.log(e);
        setProcessingResult({
          loading: false,
          result: { repr: 'Please check manually.', hex: '' },
        });
      }
    };

    subscribe(txId, async event => {
      console.log(event);
      let result: { repr: string; hex: string } | undefined = undefined;
      if (event.tx_status === 'pending') {
        return;
      } else if (event.tx_status === 'success') {
        const tx = (await transactionsApi.GET("/extended/v1/tx/{tx_id}",
          {
            params: {
              path: {
                tx_id: txId,
              },
            }
          }));
        console.log(tx);
        result = (tx.data as TransactionWithEvents).tx_result;
      } else if (event.tx_status.startsWith('abort')) {
        result = undefined;
      }
      setProcessingResult({ loading: false, result });
      await sub.unsubscribe();
    });
  }, [txId]);

  if (!txId) {
    return null;
  }

  const normalizedTxId = txId.startsWith('0x') ? txId : `0x${txId}`;
  return (
    <>
      {processingResult.loading && (
        <>
          Checking transaction status:{' '}
          <a href={`https://explorer.hiro.so/txid/${normalizedTxId}${chainSuffix}`}>
            {normalizedTxId.substring(0, 10)}...
          </a>
        </>
      )}
      {!processingResult.loading && processingResult.result && (
        <>
          {resultPrefix}
          {processingResult.result.repr}
        </>
      )}{' '}
      <div
        role="status"
        className={`${processingResult?.loading ? '' : 'd-none'
          } spinner-border spinner-border-sm text-info align-text-top mr-2`}
      />
    </>
  );
}
