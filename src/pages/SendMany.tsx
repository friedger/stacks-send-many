import { StacksNetworkName } from '@stacks/network';
import { Link } from 'react-router-dom';
import { Instructions } from '../components/Instructions';
import { Profile } from '../components/Profile';
import { SendManyInputContainer } from '../components/SendManyInputContainer';
import { SendManyTxList } from '../components/SendManyTxList';
import {
  Contract,
  SBTC_CONTRACT,
  SUPPORTED_ASSETS,
  SUPPORTED_SYMBOLS,
  SupportedSymbols,
  mainnet,
  mocknet,
  testnet,
} from '../lib/constants';
import { useStxAddresses } from '../lib/hooks';

export default function SendMany({
  asset,
  assetContract,
  sendManyContract,
}: {
  asset: SupportedSymbols;
  assetContract?: string;
  sendManyContract?: Contract;
}) {
  const { ownerStxAddress } = useStxAddresses();
  console.log({ assetContract });
  if (!ownerStxAddress) {
    return <div>Loading</div>;
  }

  const network: StacksNetworkName = mainnet ? 'mainnet' : testnet ? 'testnet' : 'mocknet';
  const assetInfo = SUPPORTED_ASSETS[asset].assets?.[network];
  const isSupported = asset === 'stx' || assetInfo;

  // for stx assetId is undefined
  const assetId = assetInfo?.asset || assetContract;

  return (
    <main className="panel-welcome mt-2 container">
      <div className="lead row mt-2">
        <div className="col-xs-10 col-md-12 mx-auto px-1 mb-4">
          <div className="Profile">
            <div className="row">
              <div className="col-sm-12 col-md-4 ">
                <div className="p-4 m-4 mx-auto bg-light">
                  {isSupported && (
                    <Profile stxAddress={ownerStxAddress} asset={asset} assetId={assetId} />
                  )}
                </div>
                <div className="p-4 m-4 mx-auto bg-light">
                  {isSupported && <Instructions asset={asset} network={network} />}
                </div>
              </div>

              <div className="col-sm-12 col-md-8 p-4 container">
                <div className="col-xs-10 col-md-12 bg-light p-4">
                  <div className="text-right">
                    Send{' '}
                    {SUPPORTED_SYMBOLS.filter(a => a !== asset).map(a => {
                      return (
                        <>
                          <Link
                            to={
                              network === 'mainnet'
                                ? a === 'stx'
                                  ? '/'
                                  : `/${a}`
                                : network === 'testnet'
                                  ? a === 'stx'
                                    ? '/?chain=testnet'
                                    : `/${a}?chain=testnet`
                                  : a === 'stx'
                                    ? '/?chain=mocknet'
                                    : `/${a}?chain=mocknet`
                            }
                            className="small"
                          >
                            {testnet || mocknet ? 'Test' : ''} {SUPPORTED_ASSETS[a].shortName}{' '}
                          </Link>
                          {' - '}
                        </>
                      );
                    })}
                  </div>
                  <h3 className="font-weight-bold mb-4">
                    Send {testnet || mocknet ? 'Test' : ''} {SUPPORTED_ASSETS[asset].name}
                  </h3>
                  {isSupported ? (
                    <>
                      <SendManyInputContainer
                        ownerStxAddress={ownerStxAddress}
                        asset={asset}
                        assetId={assetId}
                        sendManyContract={sendManyContract}
                        network={network}
                      />
                    </>
                  ) : (
                    <>
                      {`Send Many not supported for ${SUPPORTED_ASSETS[asset].shortName} on ${network}.`}
                    </>
                  )}
                </div>
                {asset === 'stx' && (
                  <div className="col-xs-10 col-md-12 mx-auto my-4 py-4 bg-light">
                    <SendManyTxList
                    // ownerStxAddress={ownerStxAddress}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
