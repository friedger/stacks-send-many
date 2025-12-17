import { StacksNetworkName } from '@stacks/network';
import { SUPPORTED_ASSETS, TokenSymbol } from '../lib/constants';

export function Instructions({
  asset,
  network,
}: {
  asset: TokenSymbol;
  network: StacksNetworkName;
}) {
  const usingSendManyContract = SUPPORTED_ASSETS[asset].assets?.[network]?.sendManyContract;
  return (
    <>
      <h4>Instructions</h4>
      {asset === 'stx' ? (
        <ol className="list-group small">
          <li>
            Enter recipients and amounts one per line. If all memo field are empty "send-many"
            contract for stx is used. Otherwise, "send-many-memo" contract is used.
          </li>
          <li>Review the data</li>
          <li>Click send</li>
          <li>Follow the instructions on your wallet to complete the transaction.</li>
        </ol>
      ) : usingSendManyContract ? (
        <ol className="list-group small">
          <li>
            Enter recipients and amounts one per line. The following send-many contract is used for
            the transaction:{' '}
            <pre>
              {usingSendManyContract.address}.{usingSendManyContract.name}
            </pre>{' '}
          </li>
          <li>Review the data</li>
          <li>Click send</li>
          <li>Follow the instructions on your wallet to complete the transaction.</li>
        </ol>
      ) : (
        <ol className="list-group small">
          <li>
            Enter recipients and amounts one per line. The send-many function of the token is used.
          </li>
          <li>Review the data</li>
          <li>Click send</li>
          <li>Follow the instructions on your wallet to complete the transaction.</li>
        </ol>
      )}
    </>
  );
}
