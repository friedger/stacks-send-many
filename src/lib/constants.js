import {
  TransactionsApi,
  SmartContractsApi,
  AccountsApi,
  Configuration,
  InfoApi,
} from '@stacks/blockchain-api-client';
import { StacksTestnet, StacksMainnet } from '@stacks/network';

export const testnet = window.location.search.includes('chain=testnet');
export const localMocknet = !testnet && window.location.search.includes('mocknet=local');
export const mainnet =
  (!testnet && !localMocknet) || window.location.search.includes('chain=mainnet');

export const chainSuffix = `?chain=${mainnet ? 'mainnet' : testnet ? 'testnet' : 'mocknet'}`;
export const localNode = localMocknet;
export const localAuth = false;
export const mocknet = localMocknet;

console.log({ localNode, localAuth, mocknet, testnet, mainnet });

export const CONTRACT_ADDRESS = mocknet
  ? 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6' //ADDR1 from Stacks.toml
  : testnet
  ? 'ST3CK642B6119EVC6CT550PW5EZZ1AJW6608HK60A'
  : 'SPAP1KAFW2BBAD840FSPJJJ7EVYXPCEMXNH3GNT9'; // TODO: UPDATE
export const GENESIS_CONTRACT_ADDRESS = 'ST000000000000000000002AMW42H';
export const BNS_CONTRACT_NAME = 'bns';

export const CITYCOIN_CONTRACT_NAME = 'ambitious-coral-chicken';

// TODO: add Freehold API endpoint?
export const STACK_API_URL = localNode
  ? 'http://localhost:3999'
  : mainnet
  ? 'https://stacks-node-api.mainnet.stacks.co'
  : 'https://stacks-node-api.testnet.stacks.co';
export const STACKS_API_WS_URL = localNode
  ? 'ws:localhost:3999/'
  : mainnet
  ? 'ws://stacks-node-api.mainnet.stacks.co/'
  : 'ws://stacks-node-api.testnet.stacks.co/';
export const STACKS_API_ACCOUNTS_URL = `${STACK_API_URL}/v2/accounts`;

export const NETWORK = mainnet ? new StacksMainnet() : new StacksTestnet();
NETWORK.coreApiUrl = STACK_API_URL;

const basePath = STACK_API_URL;
const config = new Configuration({ basePath });
export const accountsApi = new AccountsApi(config);
export const smartContractsApi = new SmartContractsApi(config);
export const transactionsApi = new TransactionsApi(config);
export const infoApi = new InfoApi(config);
