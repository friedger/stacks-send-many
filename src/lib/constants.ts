import {
  AccountsApi,
  Configuration,
  InfoApi,
  SmartContractsApi,
  TransactionsApi,
} from '@stacks/blockchain-api-client';
import { StacksDevnet, StacksMainnet, StacksNetworkName, StacksTestnet } from '@stacks/network';

export const testnet = window.location.search.includes('chain=testnet');
export const localMocknet = !testnet && window.location.search.includes('mocknet=local');
export const mainnet =
  (!testnet && !localMocknet) || window.location.search.includes('chain=mainnet');

// get deployer parameter value from window.location.search
const params = new URLSearchParams(window.location.search);
export const deployer = params.get('deployer');

export const chains = mainnet ? ['stacks:1'] : ['stacks:2147483648'];
export const chainSuffix = `?chain=${mainnet ? 'mainnet' : testnet ? 'testnet' : 'mocknet'}`;
export const localNode = localMocknet;
export const localAuth = false;
export const mocknet = localMocknet;

console.log({ localNode, localAuth, mocknet, testnet, mainnet });

export const CONTRACT_ADDRESS = mocknet
  ? 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6' //ADDR1 from Stacks.toml
  : testnet
    ? 'STR8P3RD1EHA8AA37ERSSSZSWKS9T2GYQFGXNA4C'
    : 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE';
export const BNS_CONTRACT_ADDRESS = 'SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF';
export const BNS_CONTRACT_NAME = 'BNS-V2';

export const SBTC_CONTRACT = {
  address: 'ST3VA3Y7A2YQ8GW69T0N1ERPAD784R1Y2YHCSNJHH',
  name: 'asset',
};

export type Contract = { address: string; name: string };

export type AssetContractInfo = {
  asset: string;
  /**
   * This contract must have function 'send-many' with
   * parameters to: principal, amount: uint, memo: optional(buff)
   * This must be provided for tokens that do not implement a send-many function with the above parameters
   */
  sendManyContract?: Contract;
};

export type AssetInfo = {
  name: string;
  shortName: string;
  symbol?: string;
  assets?: { [key in StacksNetworkName]?: AssetContractInfo };
  decimals: number;
  /**
   * sendManyContractsAddress is only used for stx and must have deployed
   * two contracts 'send-many-memo' and 'send-many'.
   * These contracts must have a function 'send-many' with parameters
   * for stx: to: principal, ustx: uint and memo: buff, resp. to: principal, ustx: uint
   */
  sendManyContractsAddress?: { [key in StacksNetworkName]?: string };
};

export type SupportedSymbols =
  | 'sbtc'
  | 'xbtc'
  | 'not'
  | 'stx'
  | 'roo'
  | 'leo'
  | 'diko'
  | 'welsh'
  | 'mega'
  | 'usda'
  | 'ststx'
  | 'aeusd'
  | 'listx'
  | 'lialex'
  | 'velar';

export const SUPPORTED_SYMBOLS: SupportedSymbols[] = [
  'sbtc',
  'xbtc',
  'not',
  'stx',
  'roo',
  'leo',
  'diko',
  'welsh',
  'mega',
  'usda',
  'ststx',
  'aeusd',
  'listx',
  'lialex',
  'velar',
];

export const SUPPORTED_ASSETS: {
  [key in SupportedSymbols]: AssetInfo;
} = {
  stx: {
    name: 'Stacks (STX)',
    shortName: '$STX',
    symbol: 'Ӿ',
    decimals: 6,
    sendManyContractsAddress: {
      mainnet: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
      testnet: 'ST3FFRX7C911PZP5RHE148YDVDD9JWVS6FZRA60VS',
      mocknet:
        //ADDR1 from Stacks.toml
        'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
    },
  },
  sbtc: {
    name: 'Wrapped BTC (sBTC)',
    shortName: '$sBTC',
    symbol: 's₿',
    decimals: 8,
    assets: {
      mainnet: {
        asset: 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token::sbtc-token',
      },
    },
  },
  xbtc: {
    name: 'Wrapped BTC (xBTC)',
    shortName: '$XBTC',
    symbol: '₿',
    decimals: 8,
    assets: {
      mainnet: {
        asset: 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin::wrapped-bitcoin',

        sendManyContract: {
          address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
          name: 'xbtc-send-many-v1',
        },
      },
    },
  },
  not: {
    name: 'Nothing (NOT)',
    shortName: '$NOT',
    decimals: 0,
    assets: {
      mainnet: {
        asset: 'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.nope::NOT',
      },
    },
  },
  roo: {
    name: 'Kangoroo (ROO)',
    shortName: '$ROO',
    decimals: 6,
    assets: {
      mainnet: {
        asset: 'SP2C1WREHGM75C7TGFAEJPFKTFTEGZKF6DFT6E2GE.kangaroo::kangaroo',
        sendManyContract: {
          address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
          name: 'roo-send-many-v1',
        },
      },
    },
  },
  leo: {
    name: 'Leo (LEO)',
    shortName: '$LEO',
    decimals: 6,
    assets: {
      mainnet: {
        asset: 'SP1AY6K3PQV5MRT6R4S671NWW2FRVPKM0BR162CT6.leo-token::leo',
      },
    },
  },
  diko: {
    name: 'Arkadiko Token',
    shortName: '$DIKO',
    decimals: 6,
    assets: {
      mainnet: {
        asset: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-token::diko',
        sendManyContract: {
          address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
          name: 'diko-send-many-v1',
        },
      },
    },
  },
  welsh: {
    name: 'Welshcorgicoin',
    shortName: '$WELSH',
    decimals: 6,
    assets: {
      mainnet: {
        asset: 'SP3NE50GEXFG9SZGTT51P40X2CKYSZ5CC4ZTZ7A2G.welshcorgicoin-token::welshcorgicoin',
      },
    },
  },
  mega: {
    name: 'Mega',
    shortName: '$MEGA',
    decimals: 2,
    assets: {
      mainnet: {
        asset: 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.mega::mega',
        sendManyContract: {
          address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
          name: 'mega-send-many-v1',
        },
      },
    },
  },
  usda: {
    name: 'USDA',
    shortName: '$USDA',
    decimals: 6,
    assets: {
      mainnet: {
        asset: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token::usda',
        sendManyContract: {
          address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
          name: 'usda-send-many-v1',
        },
      },
    },
  },
  aeusd: {
    name: 'Ethereum USDC via Allbridge',
    shortName: '$aeUSDC',
    decimals: 6,
    assets: {
      mainnet: {
        asset: 'SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K.token-aeusdc::aeUSDC',
        sendManyContract: {
          address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
          name: 'aeusdc-send-many-v1',
        },
      },
    },
  },
  ststx: {
    name: 'Stacked STX Token',
    shortName: '$stSTX',
    decimals: 6,
    assets: {
      mainnet: {
        asset: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.ststx-token::ststx',
        sendManyContract: {
          address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
          name: 'ststx-send-many-v1',
        },
      },
    },
  },
  listx: {
    name: 'Liquid STX',
    shortName: '$liSTX',
    decimals: 6,
    assets: {
      mainnet: {
        asset: 'SM26NBC8SFHNW4P1Y4DFH27974P56WN86C92HPEHH.token-lqstx::lqstx',
        sendManyContract: {
          address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
          name: 'listx-send-many-v1',
        },
      },
    },
  },
  lialex: {
    name: 'Liquid Alex',
    shortName: '$liALEX',
    decimals: 8,
    assets: {
      mainnet: {
        asset: 'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.auto-alex-v3::auto-alex-v3',
        sendManyContract: {
          address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
          name: 'lialex-send-many-v1',
        },
      },
    },
  },
  velar: {
    name: 'Velar',
    shortName: '$VELAR',
    decimals: 6,
    assets: {
      mainnet: {
        asset: 'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.velar-token::velar',
        sendManyContract: {
          address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
          name: 'velar-send-many-v1',
        },
      },
    },
  },
};

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
  ? 'http://192.168.0.208:3999'
  : mainnet
    ? 'https://api.hiro.so'
    : 'https://api.testnet.hiro.so';

export const STACKS_API_WS_URL = localNode
  ? 'ws:192.168.0.208:3999/'
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
