import { TransactionEventsResponse, connectWebSocketClient } from '@stacks/blockchain-api-client';
import { FinishedTxData, UserSession } from '@stacks/connect';
import { Storage } from '@stacks/storage';
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

import {
  ContractCallTransaction,
  MempoolContractCallTransaction,
  MempoolTransaction,
  MempoolTransactionStatus,
  TransactionEvent,
  type Transaction,
  type TransactionEventStxAsset,
} from '@stacks/stacks-blockchain-api-types';
interface Subscription {
  unsubscribe(): Promise<void>;
}
export type StoredTx = {
  data: {
    txId: string;
  };
  apiData?: Transaction | (MempoolTransaction & { events: TransactionEvent[] });
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
  userSession: UserSession
) {
  console.log(jsonStringify(data));
  const storage = new Storage({ userSession });
  let indexArray;
  try {
    const indexFile = await storage.getFile(indexFileName);
    if (typeof indexFile === 'string') {
      indexArray = JSON.parse(indexFile);
    }
  } catch (e) {
    console.log(e);
    indexArray = [];
  }
  indexArray.push(data.txId);
  await storage.putFile(indexFileName, jsonStringify(indexArray));
  await storage.putFile(`txs/${data.txId}.json`, jsonStringify({ data }));
}

export async function getTxs(userSession: UserSession) {
  const storage = new Storage({ userSession });

  let indexArray;
  const txs: StoredTx[] = [];
  try {
    let indexFile;
    indexFile = await storage.getFile(indexFileName);
    indexArray = JSON.parse(indexFile as string);
    for (let txId of indexArray) {
      const tx = await getTxWithStorage(txId, storage);
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
export async function getTxsAsCSV(userSession: UserSession, filter: TxFilter) {
  const txs = await getTxs(userSession);
  const txsAsCSV = txs
    .filter(tx => tx.apiData && tx.apiData.tx_status === 'success')
    .filter(filter)
    .reduce((result, tx) => {
      // casting to confirmed since it's checked anyway ⬆️
      const txData = tx.apiData as Transaction;
      const stxEvents = txData.events.filter(
        e => e.event_type === 'stx_asset'
      ) as TransactionEventStxAsset[];

      return (
        result +
        stxEvents
          .filter(e => e.event_type === 'stx_asset')
          .reduce((eventResult, e) => {
            return (
              eventResult +
              `${e.asset.recipient}, ${Number(e.asset.amount || 0) / 1000000}, ${
                txData.burn_block_time_iso
              }, https://explorer.hiro.so/txid/${
                txData.tx_id
              }, https://stacks-send-many.pages.dev/txid/${txData.tx_id}${chainSuffix}\n`
            );
          }, '')
      );
    }, 'recipient, amount, timestamp, explorer_url, send_many_url\n');
  return txsAsCSV;
}

export async function getTxsAsJSON(userSession: UserSession, filter: TxFilter) {
  type jsonTx = {
    recipient: string;
    amount: number;
    timestamp: string;
    explorer_url: string;
    send_many_url: string;
  };
  const txs = await getTxs(userSession);
  const txsAsJSON = txs
    .filter(tx => tx.apiData && tx.apiData.tx_status === 'success')
    .filter(filter)
    .reduce((result, tx) => {
      const txData = tx.apiData as Transaction;
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

async function getTxWithStorage(txId: string, storage: Storage) {
  try {
    const txFile = await storage.getFile(`txs/${txId}.json`);
    let tx: StoredTx;
    if (!txFile) {
      throw new Error(`No transaction file for ${txId}.`);
    }

    tx = JSON.parse(txFile as string);
    if (!txFile || !tx.data) {
      tx = { data: { txId } };
    }
    if (!tx.apiData || tx.apiData.tx_status === 'pending') {
      tx = await createTxWithApiData(txId, tx, storage);
    }
    return tx;
  } catch (e) {
    console.log(e);

    return createTxWithApiData(txId, { data: { txId } }, storage);
  }
}

async function getTxWithoutStorage(txId: string) {
  return createTxWithApiData(txId, { data: { txId } });
}

const mempoolStatuses: MempoolTransactionStatus[] = [
  'dropped_problematic',
  'dropped_replace_across_fork',
  'dropped_replace_by_fee',
  'dropped_stale_garbage_collect',
  'dropped_too_expensive',
  'pending',
];

export async function getTx(txId: string, userSession: UserSession) {
  if (userSession && userSession.isUserSignedIn()) {
    const storage = new Storage({ userSession });
    return getTxWithStorage(txId, storage);
  } else {
    return getTxWithoutStorage(txId);
  }
}

function joinEvents(allEvents: TransactionEvent[], newEvents: TransactionEvent[]) {
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
  storage?: Storage
) {
  let eventOffset = 0;
  const eventLimit = 20;
  let events: TransactionEvent[] = [];
  let apiData: ContractCallTransaction | MempoolContractCallTransaction;
  let moreEvents = true;
  let lastEventsLength = 0;

  apiData = (await transactionsApi.getTransactionById({
    txId,
    eventOffset,
    eventLimit,
    unanchored: true,
  })) as ContractCallTransaction | MempoolContractCallTransaction;

  const isOutOfMempool = mempoolStatuses.includes(apiData?.tx_status as MempoolTransactionStatus);
  if (!isOutOfMempool && apiData.tx_status === 'success') {
    console.log(apiData.events.length, apiData.event_count);
    moreEvents = apiData.events.length < apiData.event_count;

    let eventsResponse: TransactionEventsResponse | undefined;
    while (moreEvents) {
      /*
      eventsResponse = await transactionsApi.getFilteredEvents({
        txId: '76bfd6994e7d1aa74693fca166f5f0299485f4ba918c30e7260a8c073296f36b',
        type: [
          GetFilteredEventsTypeEnum.fungible_token_asset,
          GetFilteredEventsTypeEnum.non_fungible_token_asset,
          GetFilteredEventsTypeEnum.smart_contract_log,
          GetFilteredEventsTypeEnum.stx_asset,
          GetFilteredEventsTypeEnum.stx_lock,
        ],
        offset: eventOffset,
        limit: eventLimit,
      });
      */
      apiData = (await transactionsApi.getTransactionById({
        txId,
        eventOffset,
        eventLimit,
      })) as ContractCallTransaction;

      console.log({ eventsResponse });

      const data = apiData;
      console.log(eventOffset, data.events.length, apiData.event_count);
      events = joinEvents(events, data.events);
      moreEvents = events.length > lastEventsLength;
      lastEventsLength = events.length;
      eventOffset = lastEventsLength;
      console.log(isOutOfMempool, events.length, apiData.event_count, lastEventsLength);
    }
  }
  const txWithApiData: StoredTx = {
    ...tx,
    apiData: { ...(apiData as Transaction | MempoolTransaction), events },
  };

  if (storage && apiData?.tx_status !== 'pending') {
    await storage.putFile(`txs/${txId}.json`, jsonStringify(txWithApiData));
  }
  return txWithApiData;
}

export function TxStatus({ txId, resultPrefix }: { txId?: string; resultPrefix?: string }) {
  const [processingResult, setProcessingResult] = useState<{
    loading: boolean;
    result?: Transaction['tx_result'];
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
      update: (event: Transaction | MempoolTransaction) => void
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
      let result;
      if (event.tx_status === 'pending') {
        return;
      } else if (event.tx_status === 'success') {
        const tx = (await transactionsApi.getTransactionById({ txId })) as Transaction;
        console.log(tx);
        result = tx.tx_result;
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
            {normalizedTxId.substr(0, 10)}...
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
        className={`${
          processingResult?.loading ? '' : 'd-none'
        } spinner-border spinner-border-sm text-info align-text-top mr-2`}
      />
    </>
  );
}
