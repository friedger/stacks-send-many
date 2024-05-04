import {
  TransactionsApi,
  SmartContractsApi,
  AccountsApi,
  Configuration,
  InfoApi,
  NamesApi,
} from '@stacks/blockchain-api-client';
import { StacksTestnet, StacksMainnet, StacksDevnet } from '@stacks/network';

export const testnet = window.location.search.includes('chain=testnet');
export const localMocknet = !testnet && window.location.search.includes('mocknet=local');
export const mainnet =
  (!testnet && !localMocknet) || window.location.search.includes('chain=mainnet');

export const chains = mainnet ? ['stacks:1'] : ['stacks:2147483648'];
export const chainSuffix = `?chain=${mainnet ? 'mainnet' : testnet ? 'testnet' : 'mocknet'}`;
export const beta = window.location.search.includes('authorigin=beta');
export const localNode = localMocknet;
export const localAuth = false;
export const mocknet = localMocknet;

console.log({ localNode, localAuth, beta, mocknet, testnet, mainnet });
export const authOrigin = localAuth
  ? 'http://localhost:8080'
  : beta
    ? 'https://pr-725.app.stacks.engineering/'
    : 'https://app.blockstack.org';

export const CONTRACT_ADDRESS = mocknet
  ? 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6' //ADDR1 from Stacks.toml
  : testnet
    ? 'STR8P3RD1EHA8AA37ERSSSZSWKS9T2GYQFGXNA4C'
    : 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE';
export const GENESIS_CONTRACT_ADDRESS = mocknet
  ? 'ST000000000000000000002AMW42H'
  : testnet
    ? 'ST000000000000000000002AMW42H'
    : 'SP000000000000000000002Q6VF78';
export const BNS_CONTRACT_NAME = 'bns';

export const SBTC_CONTRACT = 'ST3VA3Y7A2YQ8GW69T0N1ERPAD784R1Y2YHCSNJHH.asset';

export const WRAPPED_BITCOIN_ASSET =
  'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin::wrapped-bitcoin';
export const WRAPPED_BITCOIN_CONTRACT = {
  address: 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR',
  name: 'Wrapped-Bitcoin',
  asset: 'wrapped-bitcoin',
};

export const WMNO_ASSET =
  'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wrapped-nothing-v8::wrapped-nthng';
export const WMNO_CONTRACT = {
  address: 'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ',
  name: 'wrapped-nothing-v8',
  asset: 'wrapped-nthng',
};

export const NOT_ASSET = 'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.nope::NOT';
export const NOT_CONTRACT = {
  address: 'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ',
  name: 'nope',
  asset: 'NOT',
};

export const XBTC_SEND_MANY_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'xbtc-send-many-v1',
};

export const STACK_API_URL = localNode
  ? 'http://localhost:3999'
  : mainnet
    ? 'https://api.hiro.so'
    : 'https://api.testnet.hiro.so';

export const STACKS_API_WS_URL = localNode
  ? 'ws:localhost:3999/'
  : mainnet
    ? 'wss://api.hiro.so/'
    : 'wss://api.testnet.hiro.so/';
export const STACKS_API_ACCOUNTS_URL = `${STACK_API_URL}/v2/accounts`;

export const NETWORK = localNode
  ? new StacksDevnet()
  : mainnet
    ? new StacksMainnet()
    : new StacksTestnet();

// mainnet ? new StacksMainnet() : new StacksTestnet();
// NETWORK.coreApiUrl = STACK_API_URL;

const basePath = STACK_API_URL;
const config = new Configuration({ basePath });
export const accountsApi = new AccountsApi(config);
export const smartContractsApi = new SmartContractsApi(config);
export const transactionsApi = new TransactionsApi(config);
export const infoApi = new InfoApi(config);
export const namesApi = new NamesApi(config);
